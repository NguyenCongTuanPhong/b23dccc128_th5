import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import { Course, CourseFilter, CourseStatus } from '@/types/course';
import CourseForm from '@/components/CourseForm';
import { getInstructors } from '@/services/course';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface CourseManagementProps {
  dispatch: Dispatch;
  courses: Course[];
  filters: CourseFilter;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  dispatch,
  courses,
  filters,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const instructors = getInstructors();

  useEffect(() => {
    dispatch({ type: 'course/fetchCourses' });
  }, []);

  const handleSearch = (value: string) => {
    dispatch({
      type: 'course/setFilters',
      payload: { ...filters, searchText: value },
    });
  };

  const handleFilterChange = (key: keyof CourseFilter, value: any) => {
    dispatch({
      type: 'course/setFilters',
      payload: { ...filters, [key]: value },
    });
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setFormVisible(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    const success = await dispatch({
      type: 'course/deleteCourse',
      payload: id,
    });
    if (success) {
      message.success('Xóa khóa học thành công');
    } else {
      message.error('Không thể xóa khóa học đã có học viên');
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (editingCourse) {
      const result = await dispatch({
        type: 'course/updateCourse',
        payload: { id: editingCourse.id, data: values },
      });
      if (result && 'error' in result) {
        message.error(result.error);
        return;
      }
      message.success('Cập nhật khóa học thành công');
    } else {
      const result = await dispatch({
        type: 'course/addCourse',
        payload: values,
      });
      if (result && 'error' in result) {
        message.error(result.error);
        return;
      }
      message.success('Thêm khóa học thành công');
    }
    setFormVisible(false);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = !filters.searchText || 
      course.name.toLowerCase().includes(filters.searchText.toLowerCase());
    const matchesInstructor = !filters.instructor || 
      course.instructor === filters.instructor;
    const matchesStatus = !filters.status || 
      course.status === filters.status;
    return matchesSearch && matchesInstructor && matchesStatus;
  });

  const columns: ColumnsType<Course> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a, b) => a.studentCount - b.studentCount,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseStatus) => {
        const statusMap = {
          [CourseStatus.OPEN]: 'Đang mở',
          [CourseStatus.CLOSED]: 'Đã kết thúc',
          [CourseStatus.PAUSED]: 'Tạm dừng',
        };
        return statusMap[status];
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Search
            placeholder="Tìm kiếm khóa học"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo giảng viên"
            style={{ width: 200 }}
            onChange={(value) => handleFilterChange('instructor', value)}
            allowClear
          >
            {instructors.map((instructor) => (
              <Option key={instructor} value={instructor}>
                {instructor}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            onChange={(value) => handleFilterChange('status', value)}
            allowClear
          >
            <Option value={CourseStatus.OPEN}>Đang mở</Option>
            <Option value={CourseStatus.CLOSED}>Đã kết thúc</Option>
            <Option value={CourseStatus.PAUSED}>Tạm dừng</Option>
          </Select>
          <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
            Thêm khóa học
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
      />

      <CourseForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onFinish={handleFormSubmit}
        initialValues={editingCourse || undefined}
        title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
      />
    </div>
  );
};

export default connect(({ course }: { course: CourseManagementProps }) => ({
  courses: course.courses,
  filters: course.filters,
}))(CourseManagement); 