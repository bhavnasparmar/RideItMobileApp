import * as React from "react"
import Svg, { Path } from "react-native-svg"

export type colorProps  = {
    color?: string;
}
export function SafetyCall({color} : colorProps) {
    return (
        <Svg width={26} height={26} fill="none">
            <Path
                fill= {color || "#18B932"}
                d="m17.936 13.982-.494.49s-1.173 1.166-4.374-2.017C9.867 9.272 11.04 8.106 11.04 8.106l.31-.309c.766-.761.838-1.983.17-2.875l-1.366-1.825c-.827-1.104-2.424-1.25-3.371-.308l-1.7 1.691c-.47.467-.785 1.073-.747 1.744.098 1.719.875 5.416 5.214 9.73 4.6 4.574 8.917 4.756 10.682 4.591.559-.052 1.044-.336 1.436-.725l1.538-1.53c1.04-1.033.746-2.804-.583-3.526l-2.07-1.125c-.872-.475-1.935-.336-2.617.343Z"
            />
        </Svg>
    )
}
