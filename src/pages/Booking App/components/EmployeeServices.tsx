import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Space, TimePicker, message, Rate, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { connect, ConnectProps, Loading } from 'umi';
import moment from 'moment';
import type { Employee } from '@/models/Employee';
import type { Service } from '@/models/Service';

const { TabPane } = Tabs;
const { Option } = Select;

interface EmployeeServiceProps extends ConnectProps {
  employees: Employee[];
  services: Service[];
  loading: boolean;
}

const EmployeeService: React.FC<EmployeeServiceProps> = ({ dispatch, employees, services, loading }) => {
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [employeeForm] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch?.({
      type: 'employee/fetchEmployees',
    });
    dispatch?.({
      type: 'service/fetchServices',
    });
  }, []);

  const handleAddEmployee = async (values: any) => {
    const formattedValues = {
      ...values,
      workSchedule: values.workSchedule.map((schedule: any) => ({
        ...schedule,
        startTime: schedule.time[0].format('HH:mm'),
        endTime: schedule.time[1].format('HH:mm'),
      })),
    };

    if (editingEmployee) {
      dispatch?.({
        type: 'employee/updateEmployee',
        payload: { ...formattedValues, id: editingEmployee.id },
      });
    } else {
      dispatch?.({
        type: 'employee/addEmployee',
        payload: formattedValues,
      });
    }

    setEmployeeModalVisible(false);
    employeeForm.resetFields();
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        dispatch?.({
          type: 'employee/deleteEmployee',
          payload: id,
        });
      },
    });
  };

  const handleEditEmployee = (record: Employee) => {
    setEditingEmployee(record);
    employeeForm.setFieldsValue({
      ...record,
      workSchedule: record.workSchedule.map(schedule => ({
        day: schedule.dayOfWeek,
        time: [moment(schedule.startTime, 'HH:mm'), moment(schedule.endTime, 'HH:mm')],
      })),
    });
    setEmployeeModalVisible(true);
  };

  const showRatingDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setRatingModalVisible(true);
  };

  const employeeColumns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      render: (position: string) => {
        const positions = {
          stylist: 'Stylist',
          technician: 'Kỹ thuật viên',
          assistant: 'Trợ lý',
          receptionist: 'Lễ tân',
        };
        return positions[position as keyof typeof positions] || position;
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number, record: Employee) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf />
          <Tooltip title="Xem chi tiết đánh giá">
            <Button
              type="link"
              icon={<StarOutlined />}
              onClick={() => showRatingDetails(record)}
            >
              {rating} ({record.ratings?.length || 0} đánh giá)
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Số khách tối đa/ngày',
      dataIndex: 'maxCustomersPerDay',
      key: 'maxCustomersPerDay',
    },
    {
      title: 'Thứ 2',
      dataIndex: 'workSchedule',
      key: 'monday',
      render: (schedule: any[]) => {
        const mondaySchedule = schedule.find(s => s.dayOfWeek === 1);
        return mondaySchedule ? `${mondaySchedule.startTime} - ${mondaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thứ 3',
      dataIndex: 'workSchedule',
      key: 'tuesday',
      render: (schedule: any[]) => {
        const tuesdaySchedule = schedule.find(s => s.dayOfWeek === 2);
        return tuesdaySchedule ? `${tuesdaySchedule.startTime} - ${tuesdaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thứ 4',
      dataIndex: 'workSchedule',
      key: 'wednesday',
      render: (schedule: any[]) => {
        const wednesdaySchedule = schedule.find(s => s.dayOfWeek === 3);
        return wednesdaySchedule ? `${wednesdaySchedule.startTime} - ${wednesdaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thứ 5',
      dataIndex: 'workSchedule',
      key: 'thursday',
      render: (schedule: any[]) => {
        const thursdaySchedule = schedule.find(s => s.dayOfWeek === 4);
        return thursdaySchedule ? `${thursdaySchedule.startTime} - ${thursdaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thứ 6',
      dataIndex: 'workSchedule',
      key: 'friday',
      render: (schedule: any[]) => {
        const fridaySchedule = schedule.find(s => s.dayOfWeek === 5);
        return fridaySchedule ? `${fridaySchedule.startTime} - ${fridaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thứ 7',
      dataIndex: 'workSchedule',
      key: 'saturday',
      render: (schedule: any[]) => {
        const saturdaySchedule = schedule.find(s => s.dayOfWeek === 6);
        return saturdaySchedule ? `${saturdaySchedule.startTime} - ${saturdaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Chủ nhật',
      dataIndex: 'workSchedule',
      key: 'sunday',
      render: (schedule: any[]) => {
        const sundaySchedule = schedule.find(s => s.dayOfWeek === 0);
        return sundaySchedule ? `${sundaySchedule.startTime} - ${sundaySchedule.endTime}` : 'Nghỉ';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmployee(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddService = async (values: any) => {
    if (editingService) {
      dispatch?.({
        type: 'service/updateService',
        payload: { ...values, id: editingService.id },
      });
    } else {
      dispatch?.({
        type: 'service/addService',
        payload: values,
      });
    }

    setServiceModalVisible(false);
    serviceForm.resetFields();
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        dispatch?.({
          type: 'service/deleteService',
          payload: id,
        });
      },
    });
  };

  const handleEditService = (record: Service) => {
    setEditingService(record);
    serviceForm.setFieldsValue(record);
    setServiceModalVisible(true);
  };

  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => new Intl.NumberFormat('vi-VN').format(price),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Service) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditService(record)}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteService(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Nhân viên & Dịch vụ">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Nhân viên" key="1">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingEmployee(null);
              employeeForm.resetFields();
              setEmployeeModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Thêm nhân viên
          </Button>
          <Table 
            columns={employeeColumns} 
            dataSource={employees} 
            loading={loading}
            rowKey="id"
            scroll={{ x: true }} 
          />
        </TabPane>
        
        <TabPane tab="Dịch vụ" key="2">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setServiceModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Thêm dịch vụ
          </Button>
          <Table columns={serviceColumns} dataSource={services} rowKey="id" />
        </TabPane>
      </Tabs>

      {/* Employee Modal */}
      <Modal
        title={editingEmployee ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        visible={employeeModalVisible}
        onOk={employeeForm.submit}
        onCancel={() => {
          setEmployeeModalVisible(false);
          employeeForm.resetFields();
          setEditingEmployee(null);
        }}
        width={600}
      >
        <Form
          form={employeeForm}
          layout="vertical"
          onFinish={handleAddEmployee}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên nhân viên" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
          >
            <Select placeholder="Chọn vị trí">
              <Option value="stylist">Stylist</Option>
              <Option value="technician">Kỹ thuật viên</Option>
              <Option value="assistant">Trợ lý</Option>
              <Option value="receptionist">Lễ tân</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="maxCustomersPerDay"
            label="Số khách tối đa/ngày"
            rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>

          <Form.List name="workSchedule">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      {...field}
                      label="Ngày"
                      name={[field.name, 'day']}
                      rules={[{ required: true, message: 'Chọn ngày!' }]}
                    >
                      <Select style={{ width: 120 }}>
                        {[1, 2, 3, 4, 5, 6, 0].map(day => (
                          <Option key={day} value={day}>
                            {moment().day(day).format('dddd')}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Giờ làm việc"
                      name={[field.name, 'time']}
                      rules={[{ required: true, message: 'Chọn giờ!' }]}
                    >
                      <TimePicker.RangePicker format="HH:mm" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        Xóa
                      </Button>
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm lịch làm việc
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Service Modal */}
      <Modal
        title={editingService ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ mới"}
        visible={serviceModalVisible}
        onOk={serviceForm.submit}
        onCancel={() => {
          setServiceModalVisible(false);
          serviceForm.resetFields();
          setEditingService(null);
        }}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          onFinish={handleAddService}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ!' }]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết về dịch vụ" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
          >
            <InputNumber
              min={0}
              step={10000}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện!' }]}
          >
            <InputNumber min={5} max={480} step={5} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Rating Details Modal */}
      <Modal
        title={`Đánh giá của ${selectedEmployee?.name}`}
        visible={ratingModalVisible}
        onCancel={() => {
          setRatingModalVisible(false);
          setSelectedEmployee(null);
        }}
        footer={null}
        width={800}
      >
        {selectedEmployee && (
          <>
            <div style={{ marginBottom: 16 }}>
              <h3>Đánh giá trung bình: {selectedEmployee.averageRating}</h3>
              <Rate disabled defaultValue={selectedEmployee.averageRating} allowHalf />
            </div>
            <Table
              dataSource={selectedEmployee.ratings}
              rowKey="id"
              columns={[
                {
                  title: 'Khách hàng',
                  dataIndex: 'customerId',
                  key: 'customerId',
                },
                {
                  title: 'Đánh giá',
                  dataIndex: 'rating',
                  key: 'rating',
                  render: (rating: number) => <Rate disabled defaultValue={rating} />,
                },
                {
                  title: 'Nhận xét',
                  dataIndex: 'comment',
                  key: 'comment',
                },
                {
                  title: 'Thời gian',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (date: string) => new Date(date).toLocaleString('vi-VN'),
                },
              ]}
              pagination={{ pageSize: 5 }}
            />
          </>
        )}
      </Modal>
    </Card>
  );
};

export default connect(({ 
  employee, 
  service,
  loading 
}: { 
  employee: { employees: Employee[] },
  service: { services: Service[] },
  loading: Loading 
}) => ({
  employees: employee.employees,
  services: service.services,
  loading: loading.effects['employee/fetchEmployees'] || loading.effects['service/fetchServices'],
}))(EmployeeService);
  