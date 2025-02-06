import { ReactNode } from "react";

interface props {
    children: string,
    id: string,
    opcoes: ReactNode
}

const Dropdown = ({ children = '', id = '', opcoes }: props) => {

    return (
        <>
            <div id="input" className="fonte-inter">
                <div style={{ textAlign: "right" }}>
                    <label>{children}</label>
                    <select id={id} style={{ width: "170px" }}>
                        {opcoes}
                    </select>
                </div>
            </div>
        </>
    )
}

export default Dropdown;