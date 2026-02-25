// Reusable Avatar component
// Shows profilePic image if available, otherwise shows colored initial
export default function Avatar({ name = "", src = "", size = "w-10 h-10", textSize = "text-sm", onClick }) {
    const gradient = "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

    return (
        <div
            onClick={onClick}
            className={`${size} rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-white ${onClick ? "cursor-pointer" : ""}`}
            style={!src ? { background: gradient } : {}}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className={textSize}>{name?.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}
