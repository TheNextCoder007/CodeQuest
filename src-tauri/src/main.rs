// Impede que uma janela de console apareca atras do app no Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    codequest_lib::run()
}
