//
//  InterstitialAdLoader.swift
//  iosApp
//
//  Created by Mirzamehdi on 07/03/2025.
//

import Foundation
import ComposeApp
import SwiftUI
import GoogleMobileAds

class InterstitialAdLoader: NSObject, FullScreenAdLoader  {
    
    var interstitialAd: GADInterstitialAd?
    
    func load() {
        let request = GADRequest()
        GADInterstitialAd.load(
            withAdUnitID: AdsConfig.shared.getInterstitialAdId(),
            request: request,
            completionHandler: { [weak self] ad, error in
                if let error = error {
                    print("Error loading interstitial ad: \(error.localizedDescription)")
                    self?.interstitialAd = nil
                } else {
                    print("Interstitial ad is loaded")
                    self?.interstitialAd = ad
                }
            }
        )
    }
}
