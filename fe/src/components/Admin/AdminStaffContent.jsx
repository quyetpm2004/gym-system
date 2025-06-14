import { useEffect, useState } from 'react';
import ButtonAddNew from '../Button/ButtonAddNew';
import ActionButtons from '../Button/ButtonAction';
import { FaSearch } from 'react-icons/fa';
import ModalForm from '../Modal/ModalForm';
import {
    getAllUsers,
    register,
    updateUser,
    deleteUser,
} from '../../services/api';

export default function AdminStaffContent() {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [isShowModalAddStaff, setIsShowModalAddStaff] = useState(false);
    const [isShowModalEditStaff, setIsShowModalEditStaff] = useState(false);
    const [staffEdit, setStaffEdit] = useState({});

    // Lấy danh sách staff từ backend
    const fetchStaffs = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllUsers();
            // Lọc role staff (hoặc các role liên quan)
            const staffList = (res.users || []).filter(
                (u) => u.role === 'staff' || u.role === 'coach'
            );
            setStaffs(staffList);
        } catch (err) {
            setError(err.message || 'Lỗi tải danh sách nhân sự');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const staffFields = [
        {
            name: 'username',
            label: 'Tên đăng nhập',
            placeholder: 'staff123',
            required: true,
        },
        {
            name: 'name',
            label: 'Họ và tên',
            placeholder: 'Nguyễn Văn A',
            required: true,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'abc@gmail.com',
            required: true,
        },
        {
            name: 'password',
            label: 'Mật khẩu',
            type: 'password',
            placeholder: 'Nhập mật khẩu',
            required: true,
        },
        { name: 'phone', label: 'Số điện thoại', placeholder: '0987654321' },
        {
            name: 'gender',
            label: 'Giới tính',
            type: 'select',
            options: [
                { value: 'Male', label: 'Nam' },
                { value: 'Female', label: 'Nữ' },
                { value: 'Other', label: 'Khác' },
            ],
            required: true,
        },
        {
            name: 'role',
            label: 'Vai trò',
            type: 'select',
            options: [
                { value: 'staff', label: 'Nhân viên' },
                { value: 'coach', label: 'Huấn luyện viên' },
            ],
            required: true,
        },
        // { name: 'status', label: 'Trạng thái', type: 'radio', options: [ { value: 'active', label: 'Đang hoạt động' }, { value: 'inactive', label: 'Không hoạt động' } ] }
    ];

    const titleModalAddStaff = 'Thêm mới nhân sự';
    const titleModalEditStaff = 'Cập nhật nhân sự';

    const handleAddStaff = () => {
        setStaffEdit({ gender: 'Other' });
        setIsShowModalAddStaff(true);
    };
    const handleClose = () => setIsShowModalAddStaff(false);
    const handleCloseEdit = () => setIsShowModalEditStaff(false);

    const handleEditStaff = (staff) => {
        setStaffEdit(staff);
        setIsShowModalEditStaff(true);
    };

    // Xóa staff
    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Bạn có muốn xóa nhân sự này không?')) return;
        setLoading(true);
        setError('');
        try {
            await deleteUser(id);
            await fetchStaffs();
        } catch (err) {
            setError(err.message || 'Lỗi xóa nhân sự');
        } finally {
            setLoading(false);
        }
    };

    // Thêm mới hoặc cập nhật staff
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            let username = data.username;
            if (!username || username.trim() === '') {
                const timestamp = Date.now();
                if (data.email && data.email.includes('@')) {
                    username = data.email.split('@')[0] + '_' + timestamp;
                } else if (data.name) {
                    username =
                        data.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() +
                        '_' +
                        timestamp;
                } else {
                    username = 'staff_' + timestamp;
                }
            }
            const role = data.role || 'staff';
            if (isShowModalAddStaff) {
                const result = await register(
                    data.name,
                    data.email,
                    data.password,
                    data.phone,
                    1990,
                    role,
                    data.gender || 'Other',
                    username
                );
                if (!result.success) {
                    setError(result.message || 'Lỗi đăng ký');
                    return;
                }
                setIsShowModalAddStaff(false);
            } else if (isShowModalEditStaff && staffEdit && staffEdit._id) {
                const result = await updateUser(staffEdit._id, {
                    ...data,
                    role,
                    username,
                });
                if (!result.success) {
                    setError(result.message || 'Lỗi cập nhật');
                    return;
                }
                setIsShowModalEditStaff(false);
            }
            await fetchStaffs();
        } catch (err) {
            console.error('Error in onSubmit:', err);
            setError(err.message || 'Lỗi lưu nhân sự');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-content">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4>Danh sách nhân sự</h4>
                <ButtonAddNew handleAdd={handleAddStaff} label="Thêm mới" />
            </div>
            {loading && <div>Đang tải...</div>}
            {error && <div className="text-danger">{error}</div>}
            <form className="d-flex flex-wrap mt-2 gap-2" role="search">
                <input
                    className="form-control"
                    style={{ width: 200 }}
                    type="text"
                    placeholder="Tên tài khoản"
                />
                <input
                    className="form-control"
                    style={{ width: 200 }}
                    type="text"
                    placeholder="Số điện thoại"
                />
                <input
                    className="form-control"
                    style={{ width: 200 }}
                    type="text"
                    placeholder="Vai trò"
                />
                <button
                    className="btn"
                    type="submit"
                    style={{ background: '#0b8f50', color: '#fff' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0da35c';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0b8f50';
                    }}>
                    <FaSearch fontSize={14} style={{ marginBottom: 2 }} /> Tìm
                    kiếm
                </button>
            </form>
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        <td>
                            <strong>Email</strong>
                        </td>
                        <td>
                            <strong>Tên đăng nhập</strong>{' '}
                        </td>
                        <td>
                            <strong>Họ và tên</strong>
                        </td>
                        <td>
                            <strong>Số điện thoại</strong>
                        </td>
                        <td>
                            <strong>Vai trò</strong>
                        </td>
                        <td>
                            <strong>Hành động</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((staff) => (
                        <tr key={staff._id}>
                            <td>{staff.email}</td>
                            <td>{staff.username}</td>
                            <td>{staff.name}</td>
                            <td>{staff.phone}</td>
                            <td>
                                {staff.role === 'coach'
                                    ? 'Huấn luyện viên'
                                    : 'Nhân viên'}
                            </td>
                            <td>
                                <ActionButtons
                                    onEdit={() => handleEditStaff(staff)}
                                    onDelete={() =>
                                        handleDeleteStaff(staff._id)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ModalForm
                show={isShowModalAddStaff}
                handleClose={handleClose}
                title={titleModalAddStaff}
                fields={staffFields}
                data={{}}
                onSubmit={onSubmit}
            />
            <ModalForm
                show={isShowModalEditStaff}
                handleClose={handleCloseEdit}
                title={titleModalEditStaff}
                fields={staffFields}
                data={staffEdit}
                onSubmit={onSubmit}
            />
        </div>
    );
}
