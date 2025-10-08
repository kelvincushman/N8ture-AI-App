//
//  AdMobBannerView.swift
//  iosApp
//
//  Created by Mirzamehdi on 02/03/2025.
//

import Foundation
import SwiftUI
import GoogleMobileAds


struct BannerAdView: UIViewRepresentable {
    
    let bannerAdUnitId: String
    var onAdLoaded: (() -> Void)?
    var onAdFailedToLoad: (() -> Void)?

    
    func makeUIView(context: Context) -> GADBannerView {
        let bannerView = GADBannerView(adSize: GADAdSizeBanner)
        bannerView.adUnitID = bannerAdUnitId
        let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
        if let rootViewController = windowScene?.windows.first?.rootViewController {
            bannerView.rootViewController = rootViewController
        }
        
        bannerView.delegate = context.coordinator
        bannerView.load(GADRequest())
        return bannerView
    }
    
    func updateUIView(_ uiView: GADBannerView, context: Context) {
        
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(
            onAdLoaded: onAdLoaded,
            onAdFailedToLoad: onAdFailedToLoad
        )
    }
    
    class Coordinator: NSObject, GADBannerViewDelegate {
        var onAdLoaded: (() -> Void)?
        var onAdFailedToLoad: (() -> Void)?

        init(onAdLoaded: (() -> Void)?, onAdFailedToLoad: (() -> Void)?) {
            self.onAdLoaded = onAdLoaded
            self.onAdFailedToLoad = onAdFailedToLoad
        }

        // This method is called when the ad is loaded successfully
        func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
            onAdLoaded?()  // Trigger the callback when the ad is loaded
        }
        
        func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) {
            onAdFailedToLoad?()
        }

    }

}


