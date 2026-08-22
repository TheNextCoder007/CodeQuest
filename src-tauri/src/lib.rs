// Aplicacao desktop do CodeQuest (Windows / Linux) com Tauri 2.
//
// O executavel apenas hospeda a interface web ja compilada (pasta `out/`) em
// uma WebView do sistema - por isso o instalador fica na casa dos poucos MB,
// em vez das centenas de MB de um app Electron.

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init());

    // Deep link `codequest://auth-callback`: e por ele que o Google devolve o
    // usuario para o app depois do login OAuth.
    builder = builder.plugin(tauri_plugin_deep_link::init());

    builder
        .setup(|app| {
            // Em desenvolvimento, registra o schema em tempo de execucao para
            // que o deep link funcione sem instalar o app.
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                let _ = app.deep_link().register_all();
            }

            // Uma unica janela: se o SO reabrir o app pelo deep link, damos
            // foco na janela existente em vez de criar outra.
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erro ao iniciar o CodeQuest");
}
