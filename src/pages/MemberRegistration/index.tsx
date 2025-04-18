import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Table, Space, Popconfirm, Modal, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Member {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	gender: string;
	address: string;
	strength: string;
	clubId: string;
	reason: string;
}

interface Club {
	id: string;
	name: string;
}

const MemberRegistrationPage: React.FC = () => {
	const [form] = Form.useForm();
	const [members, setMembers] = useState<Member[]>([]);
	const [clubs, setClubs] = useState<Club[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingMember, setEditingMember] = useState<Member | null>(null);

	useEffect(() => {
		const storedMembers = localStorage.getItem('clubManagement_members');
		if (storedMembers) {
			setMembers(JSON.parse(storedMembers));
		}

		const storedClubs = localStorage.getItem('clubManagement_clubs');
		if (storedClubs) {
			setClubs(JSON.parse(storedClubs));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('clubManagement_members', JSON.stringify(members));
	}, [members]);

	const handleAdd = () => {
		setEditingMember(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEdit = (member: Member) => {
		setEditingMember(member);
		form.setFieldsValue(member);
		setIsModalOpen(true);
	};

	const handleFinish = (values: Omit<Member, 'id'>) => {
		if (editingMember) {
			const updatedMember = { ...editingMember, ...values };
			setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? updatedMember : m)));
			message.success('Cập nhật đơn đăng ký thành công');
		} else {
			const newMember: Member = {
				id: Date.now().toString(),
				...values,
			};
			setMembers([...members, newMember]);
			message.success('Thêm đơn đăng ký thành công');
		}

		form.resetFields();
		setIsModalOpen(false);
		setEditingMember(null);
	};

	const handleDelete = (id: string) => {
		setMembers(members.filter((member) => member.id !== id));
		message.success('Xóa đơn đăng ký thành công');
	};

	const columns = [
		{ title: 'ID', dataIndex: 'id', key: 'id' },
		{ title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
		{ title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
		{ title: 'Sở trường', dataIndex: 'strength', key: 'strength' },
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			key: 'clubId',
			render: (clubId: string) => {
				const club = clubs.find((c) => c.id === clubId);
				return club ? club.name : 'Không rõ';
			},
		},
		{ title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
		{
			title: 'Trạng thái',
			key: 'status',
			render: () => <Text type='success'>Đang hoạt động</Text>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Member) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} style={{ color: 'red' }} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Xác nhận xoá đơn đăng ký?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='link' icon={<DeleteOutlined />} style={{ color: 'red' }}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					style={{ backgroundColor: 'red', borderColor: 'red', marginBottom: 16 }}
					onClick={handleAdd}
				>
					Thêm đơn đăng ký
				</Button>

				<Table dataSource={members} columns={columns} rowKey='id' pagination={{ pageSize: 5 }} />

				<Modal
					title={editingMember ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
					open={isModalOpen}
					onCancel={() => {
						setIsModalOpen(false);
						setEditingMember(null);
						form.resetFields();
					}}
					footer={null}
				>
					<Form form={form} layout='vertical' onFinish={handleFinish} autoComplete='off'>
						<Form.Item label='Họ tên' name='fullName' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item label='Email' name='email' rules={[{ required: true }]}>
							<Input type='email' />
						</Form.Item>
						<Form.Item label='Số điện thoại' name='phone' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item label='Giới tính' name='gender' rules={[{ required: true }]}>
							<Select placeholder='Chọn giới tính'>
								<Select.Option value='Nam'>Nam</Select.Option>
								<Select.Option value='Nữ'>Nữ</Select.Option>
								<Select.Option value='Khác'>Khác</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item label='Địa chỉ' name='address' rules={[{ required: true }]}>
							<Input.TextArea />
						</Form.Item>
						<Form.Item label='Sở trường' name='strength' rules={[{ required: true }]}>
							<Input.TextArea />
						</Form.Item>
						<Form.Item label='Câu lạc bộ' name='clubId' rules={[{ required: true }]}>
							<Select placeholder='Chọn câu lạc bộ'>
								{clubs.map((club) => (
									<Select.Option key={club.id} value={club.id}>
										{club.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label='Lý do đăng ký' name='reason' rules={[{ required: true }]}>
							<Input.TextArea />
						</Form.Item>
						<Form.Item>
							<Space style={{ justifyContent: 'end', display: 'flex' }}>
								<Button
									onClick={() => {
										setIsModalOpen(false);
										setEditingMember(null);
										form.resetFields();
									}}
								>
									Hủy
								</Button>
								<Button type='primary' htmlType='submit' style={{ backgroundColor: 'red', borderColor: 'red' }}>
									{editingMember ? 'Lưu' : 'Thêm'}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</div>
	);
};

export default MemberRegistrationPage;
