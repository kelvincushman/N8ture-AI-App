//
//  AdsManagerImpl.swift
//  iosApp
//
//  Created by Mirzamehdi on 02/03/2025.
//

import Foundation
import ComposeApp
import GoogleMobileAds

class AdsManagerImpl: AdsManager {
    
    var interstitialAdLoader: FullScreenAdLoader = InterstitialAdLoader()
    var rewardedAdLoader: FullScreenAdLoader = RewardedAdLoader()
    
    func initialize_() {
        GADMobileAds.sharedInstance().start(completionHandler: nil)
    }
}
