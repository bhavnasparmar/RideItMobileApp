import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

export function CloseCircle() {
    return (
        <Svg
            width={24}
            height={24}
            fill="none"
        >
            <Circle cx={12} cy={12} r={10} fill="#8F8F8F" />
            <Path
                fill="#E9E9E9"
                d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z"
            />
        </Svg>
    )
}
