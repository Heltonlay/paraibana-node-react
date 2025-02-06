import { useEffect, useState } from "react";
import CaixaDeTexto from "../componentes/CaixaDeTexto";
import Botao from "../componentes/Botao";

const Funcionarios = () => {
    const [lista, setResposta] = useState([]);
    const [formulario, setFormulario] = useState({ id: '', nome: "", salario: 0, data_admissao: "", telefone: "" });

    useEffect(() => {
        console.log("dados capturados");
        fetch('http://localhost:8080/funcionarios')
            .then(res => res.json())
            .then(res => setResposta(res));
    }, []);

    const listaDinamica = lista.map(item =>
        <li key={item["id"]} id="item-lista" className="fonte-inter" onClick={() => { coletarDados(item["id"]) }}>
            {`${item["nome"]}, $${item["salario"]}`}
        </li>
    )

    function coletarDados(id = 0) {
        const funcionario = lista.filter(item => item["id"] == id)[0];
        const dataAdmissao = String(funcionario["data_admissao"]).substring(0, 10);
        const dados = { id: funcionario["id"], nome: funcionario["nome"], salario: funcionario["salario"], data_admissao: dataAdmissao, telefone: funcionario["telefone"] }
        setFormulario(dados);
    }

    function enviarRequisicao(metodo: string) {
        type requisicao = {
            id?: number | '',
            nome: string,
            salario: string,
            data_admissao: string,
            telefone: string
        }

        const corpo: requisicao = {
            id: (metodo == "PUT" || metodo == "DELETE") ? Number((document.getElementById("id") as HTMLInputElement).value) : '',
            nome: (document.getElementById("nome") as HTMLInputElement).value,
            salario: (document.getElementById("salario") as HTMLInputElement).value,
            data_admissao: (document.getElementById("data_admissao") as HTMLInputElement).value,
            telefone: (document.getElementById("telefone") as HTMLInputElement).value
        }

        if (metodo == "PUT " || metodo == "DELETE")
            if (corpo["id"] == '')
                return;

        console.log(corpo);

        if (metodo == "POST" || metodo == "PUT") {
            fetch('http://localhost:8080/funcionarios/' + corpo["id"], {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            })
                .then(res => console.log(res));
        } else if (metodo == "DELETE") {
            fetch('http://localhost:8080/funcionarios/' + corpo["id"], {
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
                    <form id="form">
                        <CaixaDeTexto id="id" tipo="hidden" valor={String(formulario["id"])}></CaixaDeTexto>
                        <CaixaDeTexto id="nome" tipo="text" valor={formulario["nome"]}>Nome do funcionário: </CaixaDeTexto>
                        <CaixaDeTexto id="salario" tipo="text" valor={String(formulario["salario"])}>Salário: </CaixaDeTexto>
                        <CaixaDeTexto id="data_admissao" tipo="text" valor={formulario["data_admissao"]}>Data de admissão: </CaixaDeTexto>
                        <CaixaDeTexto id="telefone" tipo="text" valor={formulario["telefone"]}>Telefone: </CaixaDeTexto>
                        <div style={{ display: "flex" }}>
                            <Botao clique={() => enviarRequisicao("POST")}>Cadastrar novo funcionário</Botao>
                            <Botao clique={() => enviarRequisicao("PUT")}>Atualizar funcionário</Botao>
                            <Botao clique={() => enviarRequisicao("DELETE")}>Deletar funcionário</Botao>
                        </div>
                    </form>
                </div >
            </div >
            <div id="detalhes" className="fonte-inter">
                {lista.length} funcionários encontrados
            </div>
        </>
    );
}

export default Funcionarios;