import { useEffect, useState } from "react";

const Horario = ({ classe = 'horario' }) => {
    const [data, setDate] = useState(new Date());
    useEffect(() => {
        const temporizador = setInterval(() => setDate(new Date()), 30000);
        return () => { clearInterval(temporizador); }
    }, []);

    return (
        <>
            <div className={classe + " fonte-inter"}>
                <h1>{data.toLocaleString('pt-BR', { weekday: 'long' })}</h1>
                <h2>{data.toLocaleString('pt-BR', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}</h2>
            </div>
        </>
    )
}

export default Horario;