import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, message, Input, Timeline } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, HistoryOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IMemberRegistration, IActionHistory, IClub } from '@/interfaces/member';
import RegistrationForm from '@/components/MemberRegistration/RegistrationForm';
import { getClubs } from '@/services/club';

const MemberRegistrationPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<IMemberRegistration[]>([]);
  const [selectedRows, setSelectedRows] = useState<IMemberRegistration[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState<IMemberRegistration | null>(null);
  const [actionHistory, setActionHistory] = useState<IActionHistory[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [clubs, setClubs] = useState<IClub[]>([]);

  // Fetch clubs from localStorage when component mounts
  useEffect(() => {
    const fetchClubs = async () => {
      const response = await getClubs();
      setClubs(response.data);
    };
    fetchClubs();
  }, []);

  const columns: ColumnsType<IMemberRegistration> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: 'male' | 'female' | 'other') => {
        const genderMap = {
          male: 'Nam',
          female: 'Nữ',
          other: 'Khác',
        };
        return genderMap[gender];
      },
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => {
        const club = clubs.find(c => c.id === clubId);
        return club ? club.name : 'N/A';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'pending' | 'approved' | 'rejected') => {
        const statusConfig = {
          pending: { color: 'gold', text: 'Đang chờ' },
          approved: { color: 'green', text: 'Đã duyệt' },
          rejected: { color: 'red', text: 'Từ chối' },
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
      filters: [
        { text: 'Đang chờ', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove([record])}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject([record])}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record)}
          >
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (registration: IMemberRegistration) => {
    setCurrentRegistration(registration);
    setIsModalVisible(true);
  };

  const handleApprove = (records: IMemberRegistration[]) => {
    Modal.confirm({
      title: `Xác nhận duyệt ${records.length} đơn đăng ký`,
      content: 'Bạn có chắc chắn muốn duyệt các đơn đăng ký đã chọn?',
      onOk: () => {
        const updatedRegistrations = registrations.map(reg => {
          if (records.find(r => r.id === reg.id)) {
            return { ...reg, status: 'approved' };
          }
          return reg;
        });
        setRegistrations(updatedRegistrations);
        
        // Add to history
        const newHistory = records.map(reg => ({
          id: Date.now().toString(),
          registrationId: reg.id,
          action: 'approve' as const,
          actionBy: 'Admin',
          actionAt: new Date().toISOString(),
        }));
        setActionHistory([...actionHistory, ...newHistory]);
        
        message.success(`Đã duyệt ${records.length} đơn đăng ký`);
        setSelectedRows([]);
      },
    });
  };

  const handleReject = (records: IMemberRegistration[]) => {
    Modal.confirm({
      title: `Xác nhận từ chối ${records.length} đơn đăng ký`,
      content: (
        <div>
          <p>Vui lòng nhập lý do từ chối:</p>
          <Input.TextArea
            rows={4}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối"
          />
        </div>
      ),
      onOk: () => {
        if (!rejectReason) {
          message.error('Vui lòng nhập lý do từ chối');
          return;
        }

        const updatedRegistrations = registrations.map(reg => {
          if (records.find(r => r.id === reg.id)) {
            return { ...reg, status: 'rejected', rejectReason };
          }
          return reg;
        });
        setRegistrations(updatedRegistrations);

        // Add to history
        const newHistory = records.map(reg => ({
          id: Date.now().toString(),
          registrationId: reg.id,
          action: 'reject' as const,
          actionBy: 'Admin',
          actionAt: new Date().toISOString(),
          reason: rejectReason,
        }));
        setActionHistory([...actionHistory, ...newHistory]);

        message.success(`Đã từ chối ${records.length} đơn đăng ký`);
        setSelectedRows([]);
        setRejectReason('');
      },
    });
  };

  const handleViewHistory = (registration: IMemberRegistration) => {
    setCurrentRegistration(registration);
    setIsHistoryModalVisible(true);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IMemberRegistration[]) => {
      setSelectedRows(selectedRows);
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentRegistration(null);
            setIsModalVisible(true);
          }}
          style={{ marginRight: 8 }}
        >
          Thêm đơn đăng ký
        </Button>
        {selectedRows.length > 0 && (
          <>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(selectedRows)}
              style={{ marginRight: 8 }}
            >
              Duyệt {selectedRows.length} đơn đã chọn
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleReject(selectedRows)}
            >
              Từ chối {selectedRows.length} đơn đã chọn
            </Button>
          </>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />

      <Modal
        title={currentRegistration ? 'Chi tiết đơn đăng ký' : 'Thêm đơn đăng ký'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <RegistrationForm
          initialValues={currentRegistration || undefined}
          clubs={clubs} // Pass clubs from state
          onSubmit={(values) => {
            if (currentRegistration) {
              setRegistrations(registrations.map(reg =>
                reg.id === currentRegistration.id ? { ...reg, ...values } : reg
              ));
              message.success('Cập nhật đơn đăng ký thành công');
            } else {
              const newRegistration: IMemberRegistration = {
                ...values,
                id: Date.now().toString(),
                status: 'pending',
                createdAt: new Date().toISOString(),
              } as IMemberRegistration;
              setRegistrations([...registrations, newRegistration]);
              message.success('Thêm đơn đăng ký thành công');
            }
            setIsModalVisible(false);
          }}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={null}
      >
        {currentRegistration && (
          <Timeline>
            {actionHistory
              .filter(history => history.registrationId === currentRegistration.id)
              .sort((a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime())
              .map(history => (
                <Timeline.Item
                  key={history.id}
                  color={history.action === 'approve' ? 'green' : 'red'}
                >
                  <p>
                    {history.action === 'approve' ? 'Đã duyệt' : 'Đã từ chối'} bởi {history.actionBy}
                  </p>
                  <p>Thời gian: {new Date(history.actionAt).toLocaleString()}</p>
                  {history.reason && <p>Lý do: {history.reason}</p>}
                </Timeline.Item>
              ))}
          </Timeline>
        )}
      </Modal>
    </div>
  );
};

export default MemberRegistrationPage; 