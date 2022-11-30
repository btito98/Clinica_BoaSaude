const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

$(document).ready(() => {
    $('input[name=tel]').mask('(00) 00000-0000');
    $('.box-plan-checkbox').hide();
    $('textarea[name=description]').val('');
    $('legend').html('0/500');
});

$('select[name=subject]').change(function (e) {
    e.preventDefault();

    $('.box-plan-checkbox').hide();

    $('.form-check-input').prop('checked', false);

    if ($('select[name=subject]').val() === 'Convênios') {
        $('.box-plan-checkbox').show();
    }
});

$('textarea[name=description]').keyup(() => {
    let count = $('textarea[name=description]').val().length;

    $('legend').html(`${count}/500`);
});

$('#form-send-mail').submit((e) => {
    e.preventDefault();

    if ($('select[name=subject]').val() === 'Convênios' && $('.form-check-input:checked').length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Campo obrigatório",
            text: "Selecione ao menos um Convênio!",
            allowEscapeKey: false,
            allowOutsideClick: false,
        });
        return;
    }

    Swal.fire({
        icon: "info",
        title: "Aguarde",
        text: "Enviando email...",
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
    Swal.showLoading();

    const greetings = getGreetings();

    const url = 'https://api.sendinblue.com/v3/smtp/email';

    const data = {
        sender: {
            email: $('input[name=email]').val()
        },
        to: [{
            email: "iramaroliveira1@hotmail.com",
            name: "Clinica Boa Saúde",
        }],
        params: {
            name: $('input[name=name]').val(),
            tel: $('input[name=tel]').val(),
            email: $('input[name=email]').val(),
            subject: $('select[name=subject]').val(),
            description: $('textarea[name=description]').val(),
            plan: {
                bradesco: $('input[name=bradesco]:checked').val(),
                hapvida: $('input[name=hapvida]:checked').val(),
                amil: $('input[name=amil]:checked').val(),
                unimed: $('input[name=unimed]:checked').val(),
                sulamerica: $('input[name=sulamerica]:checked').val(),
                saudecasseb: $('input[name=saudecasseb]:checked').val(),
                qualicorp: $('input[name=qualicorp]:checked').val(),
                smilesaude: $('input[name=smilesaude]:checked').val(),
            },
            greetings: greetings
        },
        templateId: 1,
    };

    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": 'application/json',
                "api-key": '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',
                "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
                charset: "iso-8859-1"
            },
        }).then(() => {
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Tudo Certinho :)',
                text: 'Email enviado com sucesso.',
                allowEscapeKey: false,
                allowOutsideClick: false,
            })

            $('#form-send-mail').trigger('reset');
            $('textarea[name=description]').val('');
            $('legend').html('0/500');
            $('.box-plan-checkbox').hide();
        }).catch(() => {
            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro :(",
                text: "Entre em contato com suporte via WhatsApp (71) 99999-9999",
                allowEscapeKey: false,
                allowOutsideClick: false,
            })
        });
    }, 1000);
});

function getGreetings() {
    let greetings = ['Boa madrugada', 'Bom dia', 'Boa tarde', 'Boa noite'];
    let hours = new Date().toLocaleTimeString('pt-BR', { hour: 'numeric', hour12: false });
    return greetings[(hours / 6) >> 0];
}
