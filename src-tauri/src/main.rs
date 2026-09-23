#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(all(not(debug_assertions), not(feature = "custom-protocol")))]
compile_error!("Release builds must enable the custom-protocol feature to embed the frontend assets");

#[cfg(windows)]
fn ensure_cli_console() {
    use windows_sys::Win32::Foundation::{GENERIC_WRITE, INVALID_HANDLE_VALUE};
    use windows_sys::Win32::Storage::FileSystem::{
        CreateFileW, FILE_SHARE_READ, FILE_SHARE_WRITE, OPEN_EXISTING,
    };
    use windows_sys::Win32::System::Console::{
        AttachConsole, GetStdHandle, SetStdHandle, ATTACH_PARENT_PROCESS, STD_ERROR_HANDLE,
        STD_OUTPUT_HANDLE,
    };
    const CONOUT: &[u16] = &[67, 79, 78, 79, 85, 84, 36, 0];
    unsafe {
        let cur = GetStdHandle(STD_OUTPUT_HANDLE);
        if cur != 0 && cur != INVALID_HANDLE_VALUE {
            return;
        }
        if AttachConsole(ATTACH_PARENT_PROCESS) == 0 {
            return;
        }
        let h = CreateFileW(
            CONOUT.as_ptr(),
            GENERIC_WRITE,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            std::ptr::null(),
            OPEN_EXISTING,
            0,
            0,
        );
        if h != INVALID_HANDLE_VALUE {
            SetStdHandle(STD_OUTPUT_HANDLE, h);
            SetStdHandle(STD_ERROR_HANDLE, h);
        }
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if let Some(pos) = args.iter().position(|a| a == "--cli") {
        let cli_args: Vec<String> = args.iter().skip(pos + 1).cloned().collect();
        #[cfg(windows)]
        ensure_cli_console();
        let (out, code) = zcode_switch_lib::cli::run(&cli_args);
        use std::io::Write;
        let mut stdout = std::io::stdout();
        let _ = stdout.write_all(out.as_bytes());
        let _ = stdout.write_all(b"\n");
        let _ = stdout.flush();
        std::process::exit(code);
    }
    zcode_switch_lib::run()
}
