
const Loader = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
            margin: "auto",
            background: "none",
            display: "block",
            shapeRendering: "auto",
            position: "absolute", 
            top: "0", 
            left: "0", 
            right: "0", 
            "bottom": 0
        }}
        width="24px"
        height="24px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
    >
        <circle
            cx={50}
            cy={50}
            fill="none"
            stroke="#FFF"
            strokeWidth={10}
            r={35}
            strokeDasharray="164.93361431346415 56.97787143782138"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1.5384615384615383s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
            />
        </circle>
    </svg>
);

export default Loader;