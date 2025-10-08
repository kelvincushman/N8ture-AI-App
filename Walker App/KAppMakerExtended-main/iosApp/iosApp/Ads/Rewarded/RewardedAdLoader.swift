//
//  RewardedAdLoader.swift
//  iosApp
//
//  Created by Mirzamehdi on 07/03/2025.
//

import Foundation
import ComposeApp
import SwiftUI
import GoogleMobileAds

class RewardedAdLoader: NSObject, FullScreenAdLoader  {
    
    var rewardedAd: GADRewardedAd?

    func load() {
        let request = GADRequest()
        GADRewardedAd.load(
            withAdUnitID: AdsConfig.shared.getRewardedAdId(),
            request: request,
            completionHandler: { [weak self] ad, error in
                if let error = error {
                    print("Error loading rewarding ad: \(error.localizedDescription)")
                    self?.rewardedAd = nil
                } else {
                    print("Rewarded ad is loaded")
                    self?.rewardedAd = ad
                }
            }
        )
    }
}
