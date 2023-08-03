import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeReview } from "../../store/reviews";
import "./DeleteReview.css";

function DeleteReviewModal ({reviewId, setReviewChange}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async (reviewId) => {
        await dispatch(removeReview(reviewId));
        closeModal();
        setReviewChange(prev => !prev)
    }

    return (
        <div className="review-delete-popup">
            <h1>Confirm Delete</h1>
            <p>Are your sure you want to delete this review?</p>

            <button
                className="delete-review"
                onClick={() => handleDelete(reviewId)}
            >
                Yes (Delete Review)
            </button>

            <button
                className="keep-review"
                onClick={closeModal}
            >
                No (Keep Review)
            </button>
        </div>
    )
}

export default DeleteReviewModal;
