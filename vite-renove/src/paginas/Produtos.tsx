import { useEffect, useState } from "react";
import CaixaDeTexto from "../componentes/CaixaDeTexto";
import Botao from "../componentes/Botao";
import Dropdown from "../componentes/Dropdown";

const Produtos = () => {
    const [lista, setResposta] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formulario, setFormulario] = useState({ id: '', nome: "", valor: 0, estoque: 0, categorias: [] });

    useEffect(() => {
        console.log("dados capturados");
        fetch('http://localhost:8080/produtos')
            .then(res => res.json())
            .then(res => setResposta(res));
        fetch('http://localhost:8080/categorias')
            .then(res => res.json())
            .then(res => setCategorias(res));
    }, []);


    const listaDinamica = lista.map(item =>
        <li key={item["id"]} id="item-lista" className="fonte-inter" onClick={() => { coletarDados(item["id"]) }}>
            {`${item["nome"]}, $${item["valor"]}, em estoque: ${item["estoque"]}`}
        </li>
    )

    const listaCategorias = formulario["categorias"].map(item =>
        <li key={item["id"]} className="fonte-inter">
            {item["nome"]}
        </li>
    );

    const todasCategorias = categorias.map(item =>
        <option key={item["id"]}>
            {item["nome"]}
        </option>
    );

    function coletarDados(id = 0) {
        const produto = lista.filter(item => item["id"] == id)[0];
        const dados = { id: produto["id"], nome: produto["nome"], valor: produto["valor"], estoque: produto["estoque"], categorias: produto["categorias"] }
        setFormulario(dados);
    }

    function enviarRequisicao(metodo: string) {
        type requisicao = {
            id?: number | '',
            nome: string,
            valor: number,
            estoque: number,
        }

        const corpo: requisicao = {
            id: (metodo == "PUT" || metodo == "DELETE") ? Number((document.getElementById("id") as HTMLInputElement).value) : '',
            nome: (document.getElementById("nome") as HTMLInputElement).value,
            valor: Number((document.getElementById("valor") as HTMLInputElement).value),
            estoque: Number((document.getElementById("estoque") as HTMLInputElement).value),
        }

        if (metodo == "PUT " || metodo == "DELETE")
            if (corpo["id"] == '')
                return;

        console.log(corpo);

        if (metodo == "POST" || metodo == "PUT") {
            fetch('http://localhost:8080/produtos/' + corpo["id"], {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            })
                .then(res => console.log(res));
        } else if (metodo == "DELETE") {
            fetch('http://localhost:8080/produtos/' + corpo["id"], {
                method: metodo,
            })
                .then(res => console.log(res));
        }
    }

    return (
        <>
            <div id="caixa-flex">
                <ul id="scrollavel">
                    {listaDinamica}
                </ul>
                <div id="formulario">
                    <form>
                        <CaixaDeTexto id="id" tipo="hidden" valor={String(formulario["id"])}></CaixaDeTexto>
                        <CaixaDeTexto id="nome" tipo="text" valor={String(formulario["nome"])}>Nome do produto: </CaixaDeTexto>
                        <CaixaDeTexto id="valor" tipo="text" valor={String(formulario["valor"])}>Valor: </CaixaDeTexto>
                        <CaixaDeTexto id="estoque" tipo="text" valor={String(formulario["estoque"])}>Quantidade em estoque: </CaixaDeTexto>
                        <Dropdown id="categoria" opcoes={todasCategorias}>Adicionar categoria: </Dropdown>

                        <ul className="fonte-inter">
                            Categorias: {listaCategorias}
                        </ul>
                        <div style={{ display: "flex" }}>
                            <Botao clique={() => enviarRequisicao("POST")}>Cadastrar novo produto</Botao>
                            <Botao clique={() => enviarRequisicao("PUT")}>Atualizar produto</Botao>
                            <Botao clique={() => enviarRequisicao("DELETE")}>Deletar produto</Botao>
                        </div>
                    </form>
                </div>
            </div >
            <div id="detalhes" className="fonte-inter">
                {lista.length} produtos encontrados
            </div>
        </>
    );
}

export default Produtos;