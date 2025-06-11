import { FaPlus } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';

const ButtonAddNew = ({ handleAdd, label }) => {
    return (
        <button
            className="btn btn-css"
            style={{
                whiteSpace: 'nowrap',
                background: '#0b8f50',
                color: '#fff',
            }}
            onClick={handleAdd}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0da35c';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0b8f50';
            }}>
            <FaPlus fontSize={14} />{' '}
            <span style={{ marginLeft: 5, marginBottom: 2 }}>{label}</span>
        </button>
    );
};

export default ButtonAddNew;
