import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, DatePicker, TimePicker, Select, Input, Tag, Space, Statistic, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { connect, ConnectProps, Loading } from 'umi';
import moment from 'moment';
import type { Appointment } from '@/services/appointment';
import type { Employee } from '@/models/Employee';
import type { Service } from '@/models/Service';

const { TabPane } = Tabs;
const { Option } = Select;

interface AppointmentManagementProps extends ConnectProps {
  appointments: Appointment[];
  employees: Employee[];
  services: Service[];
  loading: boolean;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ 
  dispatch, 
  appointments, 
  employees, 
  services,
  loading 
}) => {
  const [visible, setVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<Appointment['status']>('pending');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch?.({
      type: 'appointment/fetchAppointments',
    });
    dispatch?.({
      type: 'employee/fetchEmployees',
    });
    dispatch?.({
      type: 'service/fetchServices',
    });
  }, []);

  // Kiểm tra xem nhân viên có làm việc vào ngày được chọn không
  const isEmployeeWorkingOnDate = (employeeId: string, date: moment.Moment) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return false;

    const dayOfWeek = date.day(); // 0 = Chủ nhật, 1-6 = Thứ 2 - Thứ 7
    return employee.workSchedule.some(schedule => schedule.dayOfWeek === dayOfWeek);
  };

  // Lấy thời gian làm việc của nhân viên trong ngày
  const getEmployeeWorkHours = (employeeId: string, date: moment.Moment) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return null;

    const dayOfWeek = date.day();
    const schedule = employee.workSchedule.find(s => s.dayOfWeek === dayOfWeek);
    return schedule ? {
      startTime: schedule.startTime,
      endTime: schedule.endTime
    } : null;
  };

  // Kiểm tra xem thời gian đã chọn có nằm trong giờ làm việc không
  const isTimeInWorkHours = (time: moment.Moment, workHours: { startTime: string, endTime: string }) => {
    const timeStr = time.format('HH:mm');
    return timeStr >= workHours.startTime && timeStr <= workHours.endTime;
  };

  // Kiểm tra xem nhân viên có lịch hẹn trùng không
  const hasConflictingAppointment = (employeeId: string, date: string, time: string) => {
    return appointments.some(appointment => 
      appointment.employee === employeeId &&
      appointment.date === date &&
      appointment.time === time &&
      appointment.status !== 'cancelled'
    );
  };

  const handleSubmit = async (values: any) => {
    const formattedDate = values.date.format('YYYY-MM-DD');
    const formattedTime = values.time.format('HH:mm');

    // Kiểm tra xem nhân viên có làm việc vào ngày này không
    if (!isEmployeeWorkingOnDate(values.employee, values.date)) {
      message.error('Nhân viên không làm việc vào ngày này!');
      return;
    }

    // Kiểm tra giờ làm việc
    const workHours = getEmployeeWorkHours(values.employee, values.date);
    if (workHours && !isTimeInWorkHours(values.time, workHours)) {
      message.error(`Nhân viên chỉ làm việc từ ${workHours.startTime} đến ${workHours.endTime}!`);
      return;
    }

    // Kiểm tra trùng lịch
    if (hasConflictingAppointment(values.employee, formattedDate, formattedTime)) {
      message.error('Nhân viên đã có lịch hẹn khác vào thời gian này!');
      return;
    }

    const formattedValues = {
      ...values,
      date: formattedDate,
      time: formattedTime,
    };

    if (editingAppointment) {
      dispatch?.({
        type: 'appointment/updateAppointment',
        payload: { ...formattedValues, id: editingAppointment.id },
      });
    } else {
      dispatch?.({
        type: 'appointment/addAppointment',
        payload: formattedValues,
      });
    }

    setVisible(false);
    form.resetFields();
    setEditingAppointment(null);
    setSelectedService('');
    setSelectedEmployee('');
    setSelectedDate(null);
  };

  const handleEdit = (record: Appointment) => {
    setEditingAppointment(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
      time: moment(record.time, 'HH:mm'),
    });
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch hẹn này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        dispatch?.({
          type: 'appointment/deleteAppointment',
          payload: id,
        });
      },
    });
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    dispatch?.({
      type: 'appointment/updateAppointmentStatus',
      payload: { id, status },
    });
  };

  const filteredAppointments = appointments.filter(
    appointment => appointment.status === activeTab
  );

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'confirmed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      pending: 'gold',
      confirmed: 'green',
      completed: 'blue',
      cancelled: 'red',
    };
    return colors[status];
  };

  const getStatusText = (status: Appointment['status']) => {
    const texts = {
      pending: 'Chờ duyệt',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return texts[status];
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (serviceId: string) => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.name : serviceId;
      },
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      render: (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? employee.name : employeeId;
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Appointment['status'], record: Appointment) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value: Appointment['status']) => handleStatusChange(record.id, value)}
        >
          {['pending', 'confirmed', 'completed', 'cancelled'].map(key => (
            <Option key={key} value={key}>
              <Space>
                {getStatusIcon(key as Appointment['status'])}
                <Tag color={getStatusColor(key as Appointment['status'])}>
                  {getStatusText(key as Appointment['status'])}
                </Tag>
              </Space>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Appointment) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const statusCounts = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const getFilteredEmployees = (serviceId: string) => {
    if (!serviceId) return [];
    
    const selectedService = services.find(s => s.id === serviceId);
    if (!selectedService) return [];

    return employees.filter(employee => {
      if (employee.position === 'stylist') return true;

      if (employee.position === 'technician') {
        return selectedService.name.includes('uốn') || 
               selectedService.name.includes('nhuộm');
      }

      if (employee.position === 'assistant') {
        return selectedService.name.includes('gội') || 
               selectedService.name.includes('massage');
      }

      return false;
    });
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    form.setFieldsValue({ employee: undefined });
    setSelectedEmployee('');
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    form.setFieldsValue({ date: undefined, time: undefined });
    setSelectedDate(null);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
    if (date && selectedEmployee) {
      const workHours = getEmployeeWorkHours(selectedEmployee, date);
      if (!workHours) {
        message.warning('Nhân viên không làm việc vào ngày này!');
        form.setFieldsValue({ time: undefined });
      }
    }
  };

  // Tạo các options cho TimePicker dựa trên lịch làm việc
  const getTimeOptions = () => {
    if (!selectedEmployee || !selectedDate) return [];

    const workHours = getEmployeeWorkHours(selectedEmployee, selectedDate);
    if (!workHours) return [];

    const options = [];
    const startTime = moment(workHours.startTime, 'HH:mm');
    const endTime = moment(workHours.endTime, 'HH:mm');
    const currentTime = moment(startTime);

    while (currentTime <= endTime) {
      const timeStr = currentTime.format('HH:mm');
      if (!hasConflictingAppointment(selectedEmployee, selectedDate.format('YYYY-MM-DD'), timeStr)) {
        options.push(timeStr);
      }
      currentTime.add(30, 'minutes');
    }

    return options;
  };

  return (
    <Card title="Quản lý Lịch hẹn" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        Đặt lịch hẹn
      </Button>
    }>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={statusCounts.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={statusCounts.confirmed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={statusCounts.completed}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={statusCounts.cancelled}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => setActiveTab(key as Appointment['status'])}
      >
        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              Chờ duyệt ({statusCounts.pending})
            </span>
          } 
          key="pending"
        >
          <Table 
            columns={columns} 
            dataSource={filteredAppointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              Đã xác nhận ({statusCounts.confirmed})
            </span>
          } 
          key="confirmed"
        >
          <Table 
            columns={columns} 
            dataSource={filteredAppointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
              Hoàn thành ({statusCounts.completed})
            </span>
          } 
          key="completed"
        >
          <Table 
            columns={columns} 
            dataSource={filteredAppointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              Đã hủy ({statusCounts.cancelled})
            </span>
          } 
          key="cancelled"
        >
          <Table 
            columns={columns} 
            dataSource={filteredAppointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={editingAppointment ? "Sửa lịch hẹn" : "Đặt lịch hẹn mới"}
        visible={visible}
        onOk={form.submit}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setEditingAppointment(null);
          setSelectedService('');
          setSelectedEmployee('');
          setSelectedDate(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="service"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
          >
            <Select 
              placeholder="Chọn dịch vụ"
              onChange={handleServiceChange}
            >
              {services.map(service => (
                <Option key={service.id} value={service.id}>
                  {service.name} - {new Intl.NumberFormat('vi-VN').format(service.price)}đ
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="employee"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
          >
            <Select 
              placeholder={selectedService ? "Chọn nhân viên" : "Vui lòng chọn dịch vụ trước"}
              disabled={!selectedService}
              onChange={handleEmployeeChange}
            >
              {getFilteredEmployees(selectedService).map(employee => (
                <Option key={employee.id} value={employee.id}>
                  {employee.name} - {
                    employee.position === 'stylist' ? 'Stylist' :
                    employee.position === 'technician' ? 'Kỹ thuật viên' :
                    employee.position === 'assistant' ? 'Trợ lý' : employee.position
                  }
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              disabled={!selectedEmployee}
              onChange={handleDateChange}
              disabledDate={(current) => {
                // Không cho chọn ngày trong quá khứ
                if (current && current < moment().startOf('day')) {
                  return true;
                }
                // Chỉ cho chọn ngày mà nhân viên làm việc
                return selectedEmployee ? !isEmployeeWorkingOnDate(selectedEmployee, current) : false;
              }}
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Giờ"
            rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
          >
            <Select
              style={{ width: '100%' }}
              disabled={!selectedDate}
              placeholder="Chọn giờ"
            >
              {getTimeOptions().map(time => (
                <Option key={time} value={time}>{time}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} placeholder="Nhập ghi chú nếu có" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default connect(({ 
  appointment,
  employee,
  service,
  loading 
}: { 
  appointment: { appointments: Appointment[] },
  employee: { employees: Employee[] },
  service: { services: Service[] },
  loading: Loading 
}) => ({
  appointments: appointment.appointments,
  employees: employee.employees,
  services: service.services,
  loading: loading.effects['appointment/fetchAppointments'],
}))(AppointmentManagement);
  