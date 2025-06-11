import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <button className="btn btn-sm me-1" style={{background: '#25bfec'}} onClick={onEdit}>
        <MdEdit size={16} color="#fff" />
      </button>
      <button className="btn btn-sm" style={{background: '#25bfec'}} onClick={onDelete}>
        <FaRegTrashAlt size={16} color="#fff" />
      </button>
    </div>
  );
};

export default ActionButtons;
