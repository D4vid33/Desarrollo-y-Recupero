window.CRMApp = window.CRMApp || {};

window.CRMApp.constants = {
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbygOQ9rTkU7G2fxC2vKS8KC-ULcvaG9xyLr4WZvaxQVRB5UfvofmajMRUMNntgIZPCgEw/exec",
    TAMANO_LOTE: 5,
    INITIAL_RESUMEN_EJECUTIVO: {
        totalCargadas: 0,
        pendientes: 0,
        oportunidades: 0,
        cerrados: 0,
        vencidos: 0,
        riesgoAlto: 0
    },
    DEFAULT_SUMMARY_CARDS: [
        { titulo: 'Total cuentas', valor: 0 },
        { titulo: 'Sin gestión', valor: 0 },
        { titulo: 'En gestión', valor: 0 },
        { titulo: 'Cerrados/Recuperados', valor: 0 }
    ],
    DEFAULT_ALERT_CARDS: [
        { titulo: 'Por vencer', valor: 0 },
        { titulo: 'Vencidos', valor: 0 },
        { titulo: 'Riesgo alto', valor: 0 },
        { titulo: 'Pendientes', valor: 0 }
    ],
    FILTRO_OPCIONES: [
        { value: 'SIN_GESTION', label: 'Sin gestión' },
        { value: 'TODOS', label: 'Todos' },
        { value: 'NO_CONTACTADO', label: 'No Contactado' },
        { value: 'EN_CONTACTO', label: 'En contacto' },
        { value: 'DIAGNOSTICO', label: 'Diagnóstico' },
        { value: 'PROPUESTA', label: 'Propuesta' },
        { value: 'NEGOCIACION', label: 'Negociación' },
        { value: 'COMPROMISO_PAGO', label: 'Compromiso de pago' },
        { value: 'SEGUIMIENTO', label: 'Seguimiento' },
        { value: 'RECUPERADO', label: 'Recuperado' },
        { value: 'CERRADO', label: 'Cerrado' },
        { value: 'ACUERDOS_POR_VENCER', label: 'Acuerdos por vencer' },
        { value: 'ACUERDOS_VENCIDOS', label: 'Acuerdos vencidos' },
        { value: 'PROPUESTAS_POR_VENCER', label: 'Propuestas por vencer' },
        { value: 'PROPUESTAS_VENCIDAS', label: 'Propuestas vencidas' }
    ],
    ETAPAS_POR_HOJA: {
        BD: [
            'No Contactado',
            'En contacto',
            'Diagnóstico',
            'Propuesta',
            'Negociación',
            'Cerrado'
        ],
        Recupero: [
            'No Contactado',
            'En contacto',
            'Compromiso de pago',
            'Seguimiento',
            'Recuperado',
            'Cerrado'
        ]
    }
};
