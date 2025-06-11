import { MdEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

const ActionButtons = ({ onEdit, onDelete }) => {
    return (
        <div>
            <button
                className="btn btn-sm me-1 pb-2"
                style={{ background: '#25bfec' }}
                onClick={onEdit}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#22c55e';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#25bfec';
                }}>
                <MdEdit size={16} color="#fff" />
            </button>
            <button
                className="btn btn-sm pb-2"
                style={{ background: '#25bfec' }}
                onClick={onDelete}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ff0033';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#25bfec';
                }}>
                <FaRegTrashAlt size={16} color="#fff" />
            </button>
        </div>
    );
};

export default ActionButtons;
