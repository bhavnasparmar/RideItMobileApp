//
//  AppDelegate.swift
//  TaxidoUserUI
//
//  Created by Bharat Cholera on 12/03/25.
//


//
//  appdelegate.swift
//  TaxidoUserUI
//
//  Created by Webiots Technologies on 11/03/25.
//

import Foundation
import UIKit
import React
import Firebase// Add this line (for firebase)
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "TaxidoUserUI"
    self.dependencyProvider = RCTAppDependencyProvider()
    
    FirebaseApp.configure() // Add this line
    print("TaxidoUserUI")
    
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  // Add the below function(for firebase)
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
  }
  
}
