import { useEffect, useState } from "react";
import { MdEdit, MdPersonAdd } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import ModalEditMember from '../Modal/ModalEditMember';
import ModalAddMember from '../Modal/ModalAddMember';
import { getMembershipsByCoach, updateMembershipStatus } from '../../services/membershipApi';
import authService from '../../services/authService';
import './ClientList.css'; // Giữ file CSS nếu cần style tùy chỉnh

export default function ClientList() {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [coach] = useState(authService.getCurrentUser());
    const [selectedMember, setSelectedMember] = useState(null);
    const [isShowModalEditMember, setIsShowModalEditMember] = useState(false);
    const [isShowModalAddMember, setIsShowModalAddMember] = useState(false);
    const [isShowDetailModal, setIsShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getMembershipsByCoach(coach?._id || coach?.id);
                if (res.success) {
                    setMemberships(res.data);
                } else {
                    setError(res.message || "Không thể tải danh sách hội viên");
                }
            } catch (err) {
                setError("Lỗi kết nối API");
            } finally {
                setLoading(false);
            }
        };
        if (coach) fetchData();
    }, [coach]);

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setIsShowModalEditMember(true);
    };

    const handleAddMember = () => {
        setIsShowModalAddMember(true);
    };

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setIsShowDetailModal(true);
    };

    const handleCloseEdit = () => {
        setIsShowModalEditMember(false);
        setSelectedMember(null);
    };

    const handleCloseAdd = () => {
        setIsShowModalAddMember(false);
    };

    const handleCloseDetail = () => {
        setIsShowDetailModal(false);
        setSelectedMember(null);
    };

    const handleAddMemberSubmit = (newMember) => {
        const nextId = memberships.length ? Math.max(...memberships.map(m => m._id)) + 1 : 1;
        setMemberships([...memberships, { ...newMember, _id: nextId }]);
    };

    const handleDeleteMember = (id) => {
        const member = memberships.find(m => m._id === id);
        const confirm = window.confirm(`Bạn có chắc muốn xóa hội viên "${member?.user?.name}" không?`);
        if (confirm) {
            const updated = memberships.filter(m => m._id !== id);
            setMemberships(updated);
        }
    };

    const handleSaveEditMember = (updatedMember) => {
        const updatedList = memberships.map(m =>
            m._id === updatedMember._id ? { ...updatedMember } : m
        );
        setMemberships(updatedList);
    };

    if (loading) return <div className="text-center py-5">Đang tải danh sách hội viên...</div>;
    if (error) return <div className="alert alert-danger m-4">{error}</div>;

    return (
        <div className="container layout-content">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="h4">Danh sách hội viên</h1>
                <button className="btn d-flex align-items-center" onClick={handleAddMember} style={{ whiteSpace: 'nowrap', background: '#0b8f50', color: '#fff'}}>
                    <MdPersonAdd size={20} className="me-2" />
                    Thêm hội viên
                </button>
            </div>

            {/* Bảng danh sách hội viên */}
            {memberships.length === 0 ? (
                <div className="text-muted text-center py-4">Chưa có hội viên nào được phân công.</div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <td><strong>Họ tên</strong> </td>
                                        <td><strong>Email</strong> </td>
                                        <td><strong>Gói tập</strong> </td>
                                        <td><strong>Thời hạn</strong> </td>
                                        <td><strong>Trạng thái</strong> </td>
                                        <td><strong>Hành động</strong> </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberships.map((m) => {
                                        const name = m.user?.name || '?';
                                        const firstChar = name.charAt(0).toUpperCase();
                                        const colorList = ['#6c5ce7', '#00b894', '#fdcb6e', '#0984e3', '#e17055', '#636e72', '#00cec9', '#d35400'];
                                        const colorIdx = m.user?._id
                                            ? m.user._id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colorList.length
                                            : Math.floor(Math.random() * colorList.length);
                                        const bgColor = colorList[colorIdx];

                                        return (
                                            <tr
                                                key={m._id}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleViewDetails(m)}
                                            >
                                                <td>
                                                    {name}
                                                </td>
                                                <td>{m.user?.email}</td>
                                                <td>{m.package?.name}</td>
                                                <td>{m.package?.durationInDays} ngày</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={m.status || 'active'}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            await updateMembershipStatus(m._id, newStatus);
                                                            const res = await getMembershipsByCoach(coach?._id || coach?.id);
                                                            if (res.success) setMemberships(res.data);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()} // Ngăn click vào select mở modal
                                                    >
                                                        <option value="active">Đang hoạt động</option>
                                                        <option value="inactive">Ngừng hoạt động</option>
                                                    </select>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleEditMember(m)}
                                                    >
                                                        <MdEdit size={16} /> Sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteMember(m._id)}
                                                    >
                                                        <FaRegTrashAlt size={16} /> Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chi tiết hội viên */}
            {isShowDetailModal && selectedMember && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{selectedMember.user?.name}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseDetail}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-3">
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: selectedMember.user?._id
                                                ? ['#6c5ce7', '#00b894', '#fdcb6e', '#0984e3', '#e17055', '#636e72', '#00cec9', '#d35400'][
                                                    selectedMember.user._id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 8
                                                  ]
                                                : '#6c5ce7',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '40px',
                                            fontWeight: 'bold',
                                            margin: '0 auto'
                                        }}
                                    >
                                        {selectedMember.user?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                </div>
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <strong>Email:</strong> {selectedMember.user?.email}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Gói tập:</strong> {selectedMember.package?.name}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Thời hạn:</strong> {selectedMember.package?.durationInDays} ngày
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Ngày đăng ký:</strong>{" "}
                                        {selectedMember.startDate ? new Date(selectedMember.startDate).toLocaleDateString() : ''}
                                    </div>
                                    <div className="list-group-itemr">
                                        <strong>Ngày kết thúc:</strong>{" "}
                                        {selectedMember.endDate ? new Date(selectedMember.endDate).toLocaleDateString() : ''}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Trạng thái thanh toán:</strong>{" "}
                                        {selectedMember.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Trạng thái học viên:</strong>{" "}
                                        {selectedMember.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={() => {
                                        handleCloseDetail();
                                        handleEditMember(selectedMember);
                                    }}
                                >
                                    <MdEdit size={16} /> Sửa
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleCloseDetail}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ModalEditMember
                show={isShowModalEditMember}
                handleClose={handleCloseEdit}
                memberEdit={selectedMember}
                onSave={handleSaveEditMember}
            />

            <ModalAddMember
                show={isShowModalAddMember}
                handleClose={handleCloseAdd}
                onAddMember={handleAddMemberSubmit}
            />
        </div>
    );
}