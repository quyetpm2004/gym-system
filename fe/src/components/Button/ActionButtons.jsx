import { MdEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

const ActionButtons = ({ onEdit, onDelete }) => {
    return (
        <div>
            <button
                className="btn btn-sm me-1 pb-2"
                style={{ background: '#418fba' }}
                onClick={onEdit}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#22c55e';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#418fba';
                }}>
                <MdEdit size={16} color="#fff" />
            </button>
            <button
                className="btn btn-sm pb-2"
                style={{ background: '#418fba' }}
                onClick={onDelete}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#d9534f';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#418fba';
                }}>
                <FaRegTrashAlt size={16} color="#fff" />
            </button>
        </div>
    );
};

export default ActionButtons;
