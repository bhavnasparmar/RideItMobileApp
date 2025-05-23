import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { useValues } from "@App"
import { appColors } from "@src/themes"


export function More() {
    const {isDark}=useValues()
    return (
        <Svg width={20} height={20} fill="none">
            <Path
                stroke={isDark?appColors.whiteColor:"#1F1F1F"}
                d="M10 2.5c-.917 0-1.667.75-1.667 1.667 0 .916.75 1.666 1.667 1.666s1.667-.75 1.667-1.666c0-.917-.75-1.667-1.667-1.667Zm0 11.667c-.917 0-1.667.75-1.667 1.666 0 .917.75 1.667 1.667 1.667s1.667-.75 1.667-1.667c0-.916-.75-1.666-1.667-1.666Zm0-5.834c-.917 0-1.667.75-1.667 1.667s.75 1.667 1.667 1.667 1.667-.75 1.667-1.667-.75-1.667-1.667-1.667Z"
            />
        </Svg>
    )
}