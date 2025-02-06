import { useEffect, useState } from "react";

const CaixaDeTexto = ({ children = '', id = '', tipo = '', valor = '' }) => {
    const [texto, setTexto] = useState("");
    useEffect(() => {
        setTexto(valor);
    }, [valor])

    function alterarValor(e: React.ChangeEvent<HTMLInputElement>) {
        setTexto(e.target.value);
    }

    return (
        <>
            <div id="input" className="fonte-inter">
                <div style={{ textAlign: "right" }}>
                    <label>{children}</label>
                    <input id={id} type={tipo} value={texto} onChange={alterarValor}></input>
                </div>
            </div>
        </>
    )
}

export default CaixaDeTexto;