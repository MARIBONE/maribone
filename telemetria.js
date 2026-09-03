(function () {
    "use strict";

    // ============================================================
    // TELEMETRIA MARIBONE
    // Versão: 1.0.0
    // Evento inicial: ACESSO_SITE
    // ============================================================

    const CONFIG = {
        API_URL: "https://telemetria.allan-edson.workers.dev/", 
        API_VERSAO: "1.0.0",

        CHAVE_SESSAO: "maribone_id_sessao",
        CHAVE_VISITANTE: "maribone_id_visitante",
        CHAVE_PRIMEIRA_VISITA: "maribone_primeira_visita",
        CHAVE_TOTAL_VISITAS: "maribone_total_visitas",

        EXPIRACAO_SESSAO: 30 * 60 * 1000 // 30 minutos
    };

    // ============================================================
    // UTILIDADES
    // ============================================================

    function gerarUUID() {
        if (window.crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === "x"
                    ? r
                    : (r & 0x3 | 0x8);

                return v.toString(16);
            }
        );
    }

    function agora() {
        return new Date();
    }

    function timestampISO() {
        return agora().toISOString();
    }

    function dataAtual() {
        const d = agora();

        return String(d.getDate()).padStart(2, "0") + "/" +
               String(d.getMonth() + 1).padStart(2, "0") + "/" +
               d.getFullYear();
    }

    function obterLocalStorage(chave) {
        try {
            return localStorage.getItem(chave);
        } catch (erro) {
            return null;
        }
    }

    function salvarLocalStorage(chave, valor) {
        try {
            localStorage.setItem(chave, valor);
        } catch (erro) {
            console.warn("Telemetria: LocalStorage indisponível.");
        }
    }

    // ============================================================
    // VISITANTE
    // ============================================================

    function obterIDVisitante() {
        let id = obterLocalStorage(CONFIG.CHAVE_VISITANTE);

        if (!id) {
            id = gerarUUID();
            salvarLocalStorage(CONFIG.CHAVE_VISITANTE, id);
        }

        return id;
    }

    // ============================================================
    // SESSÃO
    // ============================================================

    function obterSessao() {
        let sessao;

        try {
            sessao = JSON.parse(
                sessionStorage.getItem(CONFIG.CHAVE_SESSAO)
            );
        } catch (erro) {
            sessao = null;
        }

        const agoraMs = Date.now();

        if (
            !sessao ||
            !sessao.id ||
            !sessao.inicio ||
            (agoraMs - sessao.ultimaAtividade) > CONFIG.EXPIRACAO_SESSAO
        ) {
            sessao = {
                id: gerarUUID(),
                inicio: agoraMs,
                ultimaAtividade: agoraMs
            };
        } else {
            sessao.ultimaAtividade = agoraMs;
        }

        try {
            sessionStorage.setItem(
                CONFIG.CHAVE_SESSAO,
                JSON.stringify(sessao)
            );
        } catch (erro) {
            console.warn("Telemetria: SessionStorage indisponível.");
        }

        return sessao;
    }

    // ============================================================
    // PRIMEIRA VISITA / TOTAL DE VISITAS
    // ============================================================

    function obterInformacoesVisita() {

        let primeiraVisita =
            obterLocalStorage(CONFIG.CHAVE_PRIMEIRA_VISITA);

        let totalVisitas =
            parseInt(
                obterLocalStorage(CONFIG.CHAVE_TOTAL_VISITAS) || "0",
                10
            );

        if (!primeiraVisita) {
            primeiraVisita = timestampISO();

            salvarLocalStorage(
                CONFIG.CHAVE_PRIMEIRA_VISITA,
                primeiraVisita
            );
        }

        totalVisitas++;

        salvarLocalStorage(
            CONFIG.CHAVE_TOTAL_VISITAS,
            totalVisitas.toString()
        );

        return {
            primeiraVisita: primeiraVisita,
            totalVisitas: totalVisitas
        };
    }

    // ============================================================
    // DISPOSITIVO
    // ============================================================

    function detectarDispositivo() {

        const largura = window.screen.width;

        if (/iPad|Tablet/i.test(navigator.userAgent)) {
            return "Tablet";
        }

        if (/iPhone|Android|Mobile/i.test(navigator.userAgent)) {
            return "Mobile";
        }

        if (largura <= 768) {
            return "Mobile";
        }

        return "Desktop";
    }

    // ============================================================
    // SISTEMA OPERACIONAL
    // ============================================================

    function detectarSistemaOperacional() {

        const ua = navigator.userAgent;

        if (/Windows NT 10.0/i.test(ua)) return "Windows 10/11";
        if (/Windows NT 6.1/i.test(ua)) return "Windows 7";
        if (/Windows NT 6.2/i.test(ua)) return "Windows 8";
        if (/Windows NT 6.3/i.test(ua)) return "Windows 8.1";

        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
        if (/Mac OS X/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "Desconhecido";
    }

    // ============================================================
    // NAVEGADOR
    // ============================================================

    function detectarNavegador() {

        const ua = navigator.userAgent;

        if (/Edg\//i.test(ua)) return "Edge";
        if (/OPR\//i.test(ua)) return "Opera";
        if (/Firefox\//i.test(ua)) return "Firefox";
        if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
        if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari";

        return "Desconhecido";
    }

    function detectarVersaoNavegador() {

        const ua = navigator.userAgent;

        const padroes = [
            /Edg\/([\d.]+)/i,
            /OPR\/([\d.]+)/i,
            /Firefox\/([\d.]+)/i,
            /Chrome\/([\d.]+)/i,
            /Version\/([\d.]+).*Safari/i
        ];

        for (const padrao of padroes) {

            const resultado = ua.match(padrao);

            if (resultado) {
                return resultado[1];
            }
        }

        return "";
    }

    // ============================================================
    // CONEXÃO
    // ============================================================

    function obterTipoConexao() {

        if (!navigator.connection) {
            return "";
        }

        return navigator.connection.effectiveType || "";
    }

    function obterVelocidadeConexao() {

        if (!navigator.connection) {
            return "";
        }

        return navigator.connection.downlink || "";
    }

    // ============================================================
    // LOCALIZAÇÃO DO NAVEGADOR
    // ============================================================

    function obterPermissaoLocalizacao() {

        if (!navigator.geolocation) {
            return "indisponivel";
        }

        if (!navigator.permissions) {
            return "desconhecida";
        }

        return navigator.permissions
            .query({ name: "geolocation" })
            .then(function (resultado) {
                return resultado.state;
            })
            .catch(function () {
                return "desconhecida";
            });
    }

    function solicitarLocalizacao() {

        return new Promise(function (resolve) {

            if (!navigator.geolocation) {
                resolve({
                    permissao: "indisponivel",
                    latitude: "",
                    longitude: "",
                    precisao: ""
                });

                return;
            }

            navigator.geolocation.getCurrentPosition(

                function (posicao) {

                    resolve({
                        permissao: "concedida",
                        latitude: posicao.coords.latitude,
                        longitude: posicao.coords.longitude,
                        precisao: posicao.coords.accuracy
                    });
                },

                function () {

                    resolve({
                        permissao: "negada",
                        latitude: "",
                        longitude: "",
                        precisao: ""
                    });
                },

                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    // ============================================================
    // COLETA PRINCIPAL
    // ============================================================

    async function coletarAcesso() {

        const inicioCarregamento =
            performance.timeOrigin || Date.now();

        const sessao = obterSessao();

        const visita = obterInformacoesVisita();

        let permissaoLocalizacao = "desconhecida";

        try {
            permissaoLocalizacao =
                await obterPermissaoLocalizacao();
        } catch (erro) {
            permissaoLocalizacao = "desconhecida";
        }

        // --------------------------------------------------------
        // IMPORTANTE:
        // Não solicitamos GPS automaticamente nesta primeira versão.
        // Apenas verificamos o estado da permissão.
        // --------------------------------------------------------

        const dados = {

            Evento: "ACESSO_SITE",

            Data: dataAtual(),

            Pagina: window.location.pathname,

            Timestamp: timestampISO(),

            ID_Evento: gerarUUID(),

            ID_Sessao: sessao.id,

            ID_Visitante: obterIDVisitante(),

            Primeira_Visita: visita.primeiraVisita,

            Total_Visitas: visita.totalVisitas,

            Titulo: document.title || "",

            Pagina_Entrada:
                obterLocalStorage("maribone_pagina_entrada") ||
                window.location.pathname,

            Pagina_Anterior:
                document.referrer || "",

            Pagina_Saida: "",

            Tempo_Pagina: "",

            Tempo_Sessao:
                Math.floor((Date.now() - sessao.inicio) / 1000),

            Paginas_Visitadas: "",

            Origem:
                document.referrer ? "REFERRER" : "DIRETO",

            UTM_Source:
                new URLSearchParams(window.location.search).get("utm_source") || "",

            UTM_Medium:
                new URLSearchParams(window.location.search).get("utm_medium") || "",

            UTM_Content:
                new URLSearchParams(window.location.search).get("utm_content") || "",

            UTM_Term:
                new URLSearchParams(window.location.search).get("utm_term") || "",

            Dispositivo:
                detectarDispositivo(),

            Sistema_Operacional:
                detectarSistemaOperacional(),

            Navegador:
                detectarNavegador(),

            Versao_Navegador:
                detectarVersaoNavegador(),

            Idioma:
                navigator.language || "",

            Resolucao:
                window.screen.width + "x" + window.screen.height,

            Largura_Tela:
                window.screen.width,

            Altura_Tela:
                window.screen.height,

            Tema:
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light",

            Timezone:
                Intl.DateTimeFormat().resolvedOptions().timeZone || "",

            Pais: "",
            Estado: "",
            Cidade: "",

            IP_Hash: "",

            Javascript: true,

            Cookies:
                navigator.cookieEnabled ? true : false,

            Online:
                navigator.onLine ? true : false,

            Tipo_Conexao:
                obterTipoConexao(),

            Velocidade_Conexao:
                obterVelocidadeConexao(),

            User_Agent:
                navigator.userAgent || "",

            Dominio:
                window.location.hostname,

            Ambiente:
                window.location.hostname.includes("localhost")
                    ? "desenvolvimento"
                    : "producao",

            Duracao_Carregamento:
                Math.round(
                    performance.now() - inicioCarregamento
                ),

            Evento_Detalhe: "",

            Erro: "",

            API_Versao:
                CONFIG.API_VERSAO,

            // ----------------------------------------------------
            // NOVOS CAMPOS DE GEOLOCALIZAÇÃO
            // ----------------------------------------------------

            Latitude: "",

            Longitude: "",

            Precisao_Localizacao: "",

            Permissao_Localizacao:
                permissaoLocalizacao,

            Fonte_Localizacao:
                "IP"
        };

        // Salva página de entrada
        if (!obterLocalStorage("maribone_pagina_entrada")) {

            salvarLocalStorage(
                "maribone_pagina_entrada",
                window.location.pathname
            );
        }

        return dados;
    }

    // ============================================================
    // ENVIO PARA API
    // ============================================================

    async function enviar(dados) {

        if (!CONFIG.API_URL) {

            console.warn(
                "Telemetria Maribone: API ainda não configurada.",
                dados
            );

            return {
                sucesso: false,
                motivo: "API_NAO_CONFIGURADA",
                dados: dados
            };
        }

        try {

            const resposta = await fetch(
                CONFIG.API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados),

                    keepalive: true
                }
            );

            if (!resposta.ok) {

                throw new Error(
                    "HTTP " + resposta.status
                );
            }

            return await resposta.json();

        } catch (erro) {

            console.error(
                "Telemetria Maribone:",
                erro
            );

            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }

    // ============================================================
    // API PÚBLICA
    // ============================================================

    window.MariboneTelemetry = {

        iniciar: async function () {

            const dados = await coletarAcesso();

            return await enviar(dados);
        },

        event: async function (
            nomeEvento,
            detalhes
        ) {

            const sessao = obterSessao();

            const evento = {

                Evento: nomeEvento,

                Data: dataAtual(),

                Pagina:
                    window.location.pathname,

                Timestamp:
                    timestampISO(),

                ID_Evento:
                    gerarUUID(),

                ID_Sessao:
                    sessao.id,

                ID_Visitante:
                    obterIDVisitante(),

                Evento_Detalhe:
                    detalhes || "",

                Dominio:
                    window.location.hostname,

                Ambiente:
                    window.location.hostname.includes("localhost")
                        ? "desenvolvimento"
                        : "producao",

                API_Versao:
                    CONFIG.API_VERSAO
            };

            return await enviar(evento);
        },

        solicitarLocalizacao: solicitarLocalizacao,

        versao: CONFIG.API_VERSAO
    };

    // ============================================================
    // INICIALIZAÇÃO AUTOMÁTICA
    // ============================================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            function () {
                window.MariboneTelemetry.iniciar();
            }
        );

    } else {

        window.MariboneTelemetry.iniciar();
    }

})();
