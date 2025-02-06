import CaixaDeTexto from "../componentes/CaixaDeTexto";

const Vendas = () => {
    return (
        <>
            <div id="caixa-flex">
                <ul id="scrollavel">
                    <li>
                        valor1
                    </li>
                </ul>
                <div id="formulario">
                    <form>
                        <CaixaDeTexto tipo="text">Nome do cliente: </CaixaDeTexto>
                        <CaixaDeTexto tipo="text">CPF: </CaixaDeTexto>
                        <CaixaDeTexto tipo="text">Data da venda: </CaixaDeTexto>
                        <CaixaDeTexto tipo="text">Valor da compra: </CaixaDeTexto>
                    </form>
                </div>
            </div>
            <div id="detalhes" className="fonte-inter">
                10 vendas encontrados
            </div>
        </>
    );
}

export default Vendas;