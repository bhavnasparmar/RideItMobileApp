import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function CancelAnswer() {
    return (
        <Svg width={24} height={24} fill="none">
            <Path
                fill="#199675"
                d="M7.97 14.83A3.944 3.944 0 0 0 5 13.5c-2.21 0-4 1.79-4 4 0 .75.21 1.46.58 2.06.2.34.46.65.76.91.7.64 1.63 1.03 2.66 1.03 1.46 0 2.73-.78 3.42-1.94.37-.6.58-1.31.58-2.06 0-1.02-.39-1.96-1.03-2.67ZM6.6 19.08c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-.53-.53-.55.55c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l.55-.55-.53-.53a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.53.53.5-.5c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-.5.5.53.53c.29.29.29.76 0 1.06Z"
            />
            <Path
                fill="#199675"
                d="M17.25 2.43h-9.5C4.9 2.43 3 4.33 3 7.18v4.46c0 .35.36.6.7.51.42-.1.85-.15 1.3-.15 2.86 0 5.22 2.32 5.48 5.13.02.28.25.5.52.5h.55l4.23 2.82c.62.42 1.47-.04 1.47-.8v-2.02c1.42 0 2.61-.48 3.44-1.3.83-.84 1.31-2.03 1.31-3.45v-5.7c0-2.85-1.9-4.75-4.75-4.75Zm-1.42 8.38H9.17a.715.715 0 0 1 0-1.43h6.66a.715.715 0 0 1 0 1.43Z"
            />
        </Svg>
    )
}