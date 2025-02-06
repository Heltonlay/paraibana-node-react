const Botao = ({ children = '', clique = () => { } }) => {
    return (
        <>
            <button id="botao" className="fonte-inter" onClick={clique} type="button">{children}</button>
        </>
    )
}

export default Botao;