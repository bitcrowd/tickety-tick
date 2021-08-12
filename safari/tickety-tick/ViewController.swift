//
// ViewController.swift
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager

let appName = "tickety-tick"
let extensionBundleIdentifier = "net.bitcrowd.tickety-tick.Extension"

class ViewController: NSViewController {
  @IBOutlet var appNameLabel: NSTextField!

  override func viewDidLoad() {
    super.viewDidLoad()
    appNameLabel.stringValue = appName
    SFSafariExtensionManager
      .getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { state, error in
        guard let state = state, error == nil else {
          // Insert code to inform the user that something went wrong.
          return
        }

        DispatchQueue.main.async {
          if state.isEnabled {
            self.appNameLabel.stringValue = "\(appName)'s extension is currently on."
          } else {
            self.appNameLabel
              .stringValue =
              "\(appName)'s extension is currently off. You can turn it on in Safari Extensions preferences."
          }
        }
      }
  }

  @IBAction func openSafariExtensionPreferences(_: AnyObject?) {
    SFSafariApplication
      .showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
        guard error == nil else {
          // Insert code to inform the user that something went wrong.
          return
        }

        DispatchQueue.main.async {
          NSApplication.shared.terminate(nil)
        }
      }
  }
}
