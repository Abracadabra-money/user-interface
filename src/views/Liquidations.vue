<template>
  <div
    class="liquidations-view"
    :style="{ backgroundImage: `url(${mainBgGrid})` }"
  >
    <img
      src="@/assets/images/liquidations/ellipse-1.svg"
      alt=""
      class="bg-ellipse-1"
    />

    <div class="container mini">
      <h1>Liquidations</h1>

      <div class="text-block">
        <p>
          In Abracadabra Money, every NUSD is backed by a certain ibTOKEN. Unlike
          most protocols where all an individual's collateral is at risk of
          liquidation to a liquidation event, here in Abracadabra each
          Collateralized Debt Position(CDP) is isolated and only at risk of its
          own individual liquidation.
        </p>

        <p>
          To clarify, if a wizard opens two CDPs with different ibTKNs, or even
          two CDPs with the same type of ibTKNs, they are able to borrow MIMs
          versus those ibTKNs individually, and set their risk tolerance
          accordingly. So if they believe a certain ibTKN has a higher chance of
          decreasing in value, they can choose to borrow less NUSD versus that.
        </p>

        <p>
          That being said, there are still times when a wizards ibTKN collateral
          value will fall below the Loan to Value ratio (LTV) and thus be
          flagged for liquidation. In this event, 3rd party players (usually
          bots) can choose to repay all of the NUSD debt in exchange for the
          ibTKN collateral used for that specific CDP. To incentivise these 3rd
          parties, which keep the protocol healthy, wizards are not permitted to
          borrow 100% of their value and the difference between the value of the
          ibTKN and the NUSD will be claimed by the liquidators.
        </p>
      </div>
    </div>

    <div class="images-scene-wrap">
      <img
        src="@/assets/images/liquidations/dragon.svg"
        alt=""
        class="dragon"
      />
      <img
        src="@/assets/images/liquidations/skull.svg"
        alt=""
        class="skull-1"
      />
      <img
        src="@/assets/images/liquidations/princess.svg"
        alt=""
        class="princess"
      />
      <img
        src="@/assets/images/liquidations/skull.svg"
        alt=""
        class="skull-2"
      />
    </div>

    <div class="container mini">
      <h3 class="title">Let's use some numbers.</h3>

      <p>
        Merlin the wizard has some yvWETH (an ibTKN) of a value of 1000 USD.
        This token has LTV of 75%. Merlin is a mad wizard and he decides to
        borrow the maximum allowance and receives 750 NUSD tokens which he uses
        to buy ink for his magic spell book.
      </p>

      <p>
        Zoltac the Dark, has a golem set to watch this CDP and is ready to
        liquidate at a moments notice.
      </p>

      <div class="write-block">
        <img
          src="@/assets/images/liquidations/write.svg"
          alt=""
          class="write-img"
        />

        <p>
          As fate would have it, the value of yvWETH drops somewhat and Merlin’s
          collateral is no longer worth 1000USD meaning that he doesn't have 25%
          more collateral value than his debt. So, Zoltac the Dark’s golem can
          go to work on this CDP and liquidate it. Zoltac the Dark pays off the
          owed NUSD, takes those magical yvWETH tokens into his possession.
          However, Merlin is not terribly off, as he still has those NUSD tokens,
          well the ones he didn’t spend on magic ink, and he no longer has to
          pay off his debt.
        </p>
      </div>

      <p>
        There are a few important points of note regarding liquations that
        should be highlighted very clearly. These points set Abracadabra apart
        and can determine whether wizards will meet the same fate as Merlin did.
      </p>

      <h3 class="title">They are:</h3>

      <p>
        Abracadabra uses ibTKN that go up in value on their own regardless of
        price action.
      </p>
      <p>
        NUSD has interest so if a collateral, for some reason or another, does
        not increase in value, liquidations can happen. To reduce this risk, the
        team has selected ibTKNs that have a track record of increasing in value
        at a rate that far exceeds the interest rate on NUSD debt.
      </p>
      <p>
        Price action of underlying tokens in some of the ibTKNs can be quite
        volatile. To reduce this risk, the team has set tokens that have price
        action to a LTV maximum of 75%
      </p>
      <p>
        Abracadabra allows for the use of ibTKN with underlying stablecoins as
        collateral with a LTV of 90%. Although it may unlikely that these ibTKNs
        will decrease in USD value it’s not an impossibility as the underlying
        tkns may lose their price peggs from unforeseeable events. The 90%
        maximum also, incentives 3rd parties to liquidate these positions when
        applicable.
      </p>

      <p class="small-text">
        Although any person can perform a liquidation, it has become standard
        that these functions are performed by bots. Because of this, there is no
        need for a UI on the main site for this function. However, 3rd parties
        that wish to perform this function can reference the Technicals page.
      </p>
    </div>
  </div>
</template>

<script>
import mainBgGrid from "@/assets/images/main-grid.svg";
export default {
  data() {
    return {
      mainBgGrid,
    };
  },
};
</script>

<style lang="scss" scoped>
.liquidations-view {
  background-repeat: repeat;
  background-position: center;
  padding-top: $headerHeight + 85px;
  padding-bottom: $footerHeight + 85px;
  position: relative;

  .container {
    position: relative;
    z-index: 1;
  }

  .bg-ellipse-1 {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  h1 {
    margin-bottom: 40px;
  }

  .title {
    font-size: 26px;
    color: #9695f8;
    margin-bottom: 20px;
    margin-top: 40px;
    text-align: left;
  }

  p {
    font-size: 20px;
    line-height: 1.5;
    padding-bottom: 25px;
    text-align: left;
  }

  .small-text {
    font-size: 16px;
  }

  .text-block {
    background: #1d173e;
    border-radius: 20px;
    padding: 20px;
    padding-bottom: 0;
  }

  .images-scene-wrap {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    z-index: 2;
    margin: 35px auto;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;

    .dragon {
      width: 31.80555555555556%;
      height: auto;
      object-fit: contain;
    }

    .skull-1 {
      width: 7.22222222222222%;
      height: auto;
      object-fit: contain;
      margin: 0 5.20833333333333% 4.16666666666667% 4.16666666666667%;
    }

    .skull-2 {
      width: 7.22222222222222%;
      height: auto;
      object-fit: contain;
      margin: 0 0 12px 5.90277777777778%;
    }

    .princess {
      width: 10.41666666666667%;
      height: auto;
      object-fit: contain;
      margin-bottom: 9px;
    }
  }

  .write-block {
    display: flex;
    align-items: flex-start;
    margin-top: 40px;
    margin-bottom: 20px;

    .write-img {
      width: 143px;
      height: auto;
      margin-right: 20px;
    }

    p {
      max-width: calc(100% - 250px);
    }
  }
}

@media screen and(max-width: 1280px) {
  .liquidations-view .title {
    font-size: 24px;
  }

  .liquidations-view p {
    font-size: 18px;
  }
}

@media screen and(max-width: 680px) {
  .liquidations-view .write-block {
    flex-direction: column;
  }

  .liquidations-view .write-block .write-img {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .liquidations-view .write-block p {
    max-width: 100%;
  }
}
</style>
