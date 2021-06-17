<template>
  <div class="docs-view" :style="{ backgroundImage: `url(${mainBgGrid})` }">
    <div class="container mini">
      <h1>Docs</h1>

      <div class="row">
        <img src="@/assets/images/docs/book.svg" alt="" class="book-img" />

        <div class="text-wrap">
          <h3 class="title">What is Abracadabra?</h3>
          <p>
            Abracadabra is a decentralized protocol that allows wizards to mint
            the stablecoin $MIM using a variety of interest bearing tokens
            (ibTKNS) as collateral.
          </p>

          <h3 class="title">Why is this useful?</h3>
          <p>
            Many crypto wizards have funds and capital locked away in ibTKNs for
            a myriad of reasons. Perhaps, they just want the yield. Perhaps,
            they want voting and governance powers. Perhaps they just want to
            support the respective protocols by locking up the tokens.
            Regardless of the reason, there is very little opportunity to put
            this locked capital to further use. Abracadabra aims to change this.
          </p>
        </div>
      </div>

      <div class="row coins-wrap">
        <img src="@/assets/images/coin.svg" alt="" class="coin-img" />
        <img src="@/assets/images/coin.svg" alt="" class="coin-img" />
        <img src="@/assets/images/coin.svg" alt="" class="coin-img" />
      </div>

      <h3 class="title">Tokenomics</h3>

      <p>
        Abracadabra runs on the following tokens; Magic Internet Money (MIM),
        SPELL (which can be staked for sSPELL), and a variety of other
        protocol’s ibTKNs.
      </p>

      <div class="row">
        <img
          src="@/assets/images/docs/spells-tokens.png"
          alt=""
          class="spells-img"
        />
        <div class="text-wrap">
          <h3 class="title">Magic Internet Money</h3>
          <p>
            MIM is the stable coin borrowed against ibTKNs. It has a max supply
            of infinity. Meaning there is no max supply. It’s magic internet
            money after all. The token is pegged to the USD and every time 1 MIM
            is borrowed its value is pegged to USD. It is also always redeemed
            at a value of 1USD.
          </p>

          <h3 class="title">SPELL Tokens</h3>
          <p>
            The SPELL token is the governance token of Abracadabra. Holders of
            SPELL tokens can stake their token in the Abracadabra spellbook to
            mint sSPELL tokens.
          </p>
          <p>
            First and foremost sSPELL tokens grant holders voting rights in the
            governance of the protocol. As of present, governance is used for
            deciding on which ibTKNs are suitable for use as collateral in the
            Spellbook. (more on this below)
          </p>
          <p>
            sSPELL token holders also have a claim on all of the fees generated
            by the protocol proportional to their share of the max supply. There
            is a 1 month time-lock on redeeming sSPELL tokens back to SPELL
            tokens. sSPELL tokens are non-transferable tokens.
          </p>
          <p>There is a max supply of 210 000 000 000 SPELL tokens.</p>
        </div>
      </div>

      <h3 class="title">Interest Bearing Tokens</h3>

      <p>
        ibTKNs come from third party protocols such as Yearn.finance and
        Sushiswap. Governance will decide on all the protocols and ibTKNs that
        will be utilized as time progresses. ibTKNs are what the protocol users
        use to open collateralized debt positions (CDPs). To learn more about
        CDPs read here
      </p>

      <div class="row">
        <div class="contracts-col">
          <h3 class="title">Token Contracts</h3>

          <div class="token-item">
            <p>MIM Token Address:</p>
            <p>0x000000000000000000000000000000000</p>
          </div>

          <div class="token-item">
            <p>SPELL Token Address:</p>
            <p>0x000000000000000000000000000000000</p>
          </div>
          <div class="token-item">
            <p>sSPELL Token Address:</p>
            <p>0x000000000000000000000000000000000</p>
          </div>
          <div class="token-item">
            <p>Fee Treasury:</p>
            <p>0x000000000000000000000000000000000</p>
          </div>
        </div>
        <img src="@/assets/images/docs/chest.svg" alt="" class="chest-img" />
      </div>

      <h3 class="title">How to USE Abracadabra Money</h3>
      <p>
        Wizards that wish to use Abracadabra Money should first consider whether
        they have ibTokens that they can use to borrow MIM. TThereafter, they
        can visit the site and find across the top we can find the following
        buttons.
      </p>
    </div>

    <img src="@/assets/images/docs/header.png" alt="" class="header-img" />

    <div class="container mini">
      <div class="info-items-wrap">
        <div class="info-item">
          <p>
            The BORROW button is used to enter the page where wizards can open
            CDPs to mint MIM. There will also be the farming opportunities for
            SPELL tokens while these last here.
          </p>
        </div>
        <div class="info-item">
          <p>
            The SWAP button is used to enter a page where wizards can swap MIM
            tokens for other USD pegged stable coins such as USDT or DAI.
          </p>
        </div>
        <div class="info-item">
          <p>
            The ERC-20 button will allow wizards to change the blockchain they
            wish to use Abracadabra Money on.
          </p>
          <p class="mini">
            NOTE: Currently Abracadabra Money is deployed on Ethereum, Binance
            Smart Chain, Fantom Opera, but is only available on Ethereum as
            there are not enough ibTKN with reliable track records on other
            block chains. Adding ibTKN on the other blockchains will be a
            function of future governance.
          </p>
        </div>
        <div class="info-item">
          <p>
            The purple ADDRESS button displays your wallet address that is
            connected, and leads to a wizard dashboard.
          </p>
        </div>
        <div class="info-item">
          <p>
            The magic wand shows you that Abracadabra Money is magical, and the
            button will allow you to add our tokens to your Metamask wallet.
          </p>
        </div>
      </div>

      <h3 class="title">The BORROW Button</h3>
      <p>
        In this page wizards will be able to open CDPs and Borrow MIM tokens.
      </p>

      <img src="@/assets/images/docs/borrow-img.png" alt="" class="full-img" />

      <p>
        Here you will see a list of ibTKNs that are used as collateral for
        minting MIM. From left to right we see:
      </p>

      <div class="info-items-wrap">
        <div class="info-item">
          <p>Pool - This is then name of the ibTKN</p>
        </div>
        <div class="info-item">
          <p>
            Available to Borrow - Here we see the number of MIM tokens that can
            still be minted from this collateral type. To reduce risk, and to
            ensure that MIM tokens are backed by a variety of ibTKNs, each
            collateral has its own individual maximum allowance. These
            allowances can be increased via governance.
          </p>
        </div>
        <div class="info-item">
          <p>
            Loan to Value ratio (LTV) - This shows the maximum amount of value
            that this collateral can grant to the minting of MIM. For example,
            an ibTKN when a TVL of 75% can only mint at most, 75% of its value
            in MIM before being flagged for liquidation. (more liquidations
            below)
          </p>
        </div>
        <div class="info-item">
          <p>
            Interest - This number shows the interest that is incurred on the
            minted MIM. These are the fees that sSPELL token holders have a
            claim to and are paid when debts are paid off or when liquidations
            happen.
          </p>
        </div>
      </div>

      <h3 class="title">Farming SPELL Tokens</h3>
      <p>
        At genesis, Abracadabra Money will have a farming opportunity to
        distribute 66.5% of the SPELL token supply. In the following section,
        you will find the opportunities to do so.
      </p>
      <img src="@/assets/images/docs/spell-farm.png" alt="" class="full-img" />

      <div class="row">
        <div class="info-wrap">
          <p>From left to right we see:</p>

          <div class="info-item">
            <p>
              Pool - Displays which liquidity pools are eligible for farming
              SPELL tokens.
            </p>
          </div>

          <div class="info-item">
            <p>
              Yield - Displays what is the current rate of emissions of SPELL
              tokens.
            </p>
          </div>

          <div class="info-item">
            <p>ROI - Displays the APY of this pool.</p>
          </div>

          <div class="info-item">
            <p>
              TVL - Displays the total value of all the LP tokens staked here.
            </p>
          </div>

          <p>On the far right we see two buttons:</p>

          <div class="info-item">
            <p>Stake - Allows you to stake your LP tokens to earn SPELL</p>
          </div>

          <div class="info-item">
            <p>
              Unstake - Allows you to unstake your LP tokens back to your wallet
              for other uses, such as redeeming them from the protocol which
              they were made, or for staking them elsewhere for other
              opportunities.
            </p>
          </div>
        </div>
        <img
          src="@/assets/images/docs/princess.png"
          alt=""
          class="princess-img"
        />
      </div>

      <h3 class="title">Summoning some MIMs</h3>

      <p>
        When you are ready to cast your first summoning spell, click anywhere on
        the ibTKN section that houses the ibTKN you wish to use as your
        collateral.
      </p>
      <p>You will be taken to a page that looks like the following.</p>

      <img src="@/assets/images/docs/pool-inside.png" alt="" class="full-img" />

      <p class="small-text">
        The borrow and repay buttons allow you to toggle through borrowing MIM
        and repaying MIM.
      </p>
      <p class="small-text">
        The DEPOSIT COLLATERAL & BORROW MIM section displays the asset you have
        chosen as collateral and allows you to input how many of the ibTOKEN in
        your wallet that you want to deposit as collateral.
      </p>
      <p class="small-text">
        Below that, we see the Borrowing MIM section with several buttons. The
        25%, 50%, 70%, 90%, and custom, buttons all allow you to adjust how much
        of the collateral value you wish to use for borrowing MIM.
      </p>

      <p class="small-text">
        NOTE: Some assets don’t allow for 90% and this button will be disabled
        for those tokens.
      </p>

      <p class="small-text">
        Above these button, you see a calculated value at which this CDP will be
        flagged for liquidations. There is also a “safe” button that will
        suggest a % that might or might not be safe. We suggest that you
        consider carefully what ratio you are personally willing to risk. As
        There is a possibility that any % can be flagged for liquidation.
      </p>

      <p class="small-text">
        The Your Balances section shows the available tokens in your wallet for
        the selected pair.
      </p>

      <p class="small-text">
        On the right hand side, we see data that has been selected and the
        parameters of this current CDP.
      </p>

      <p class="small-text">
        Finally, we see the BORROW button, which will deposit of your ibTKNs
        into Abracadabra and Transfer MIM to your wallet, and open your CDP.
      </p>

      <h3 class="title">Repaying your MIM</h3>

      <p>
        Above, we showed that there was a REPAY button. WHen you click this, you
        are lead to the page that will allow you to repay your MIM debt, and
        interest incurred, and close down your CDPs. Clicking that will lead you
        to the following page.
      </p>

      <img src="@/assets/images/docs/repay-img.png" alt="" class="full-img" />

      <h3 class="title">SWAPing MIM and Stablecoins</h3>

      <p>
        On the main page there is the SWAP button at the top. Clicking this
        button opens the following window.
      </p>

      <img src="@/assets/images/docs/swap-img.png" alt="" class="full-img" />

      <p class="small-text">
        Here wizards are able to swap MIM for other USD stable coins such as
        USDC, USDT and DAI. This wizard interface (UI) actually interacts with
        the Uniswap V3 protocol and thus using it will subject wizards to the
        fees and regulations of Uniswap. Alternatively, wizards can go directly
        to Uniswap and make the same swap here using the native Uniswap UI and
        have the same results.
      </p>

      <h3 class="title">The DASHBOARD</h3>

      <p>
        Clicking on the purple address bar at the top of any page will take
        wizards to the Abracadabra Money Dashboard which looks like this.
      </p>

      <img
        src="@/assets/images/docs/dashboard-img.png"
        alt=""
        class="full-img"
      />

      <p class="small-text">
        The Top section allows wizards to stake, and unstake, their SPELL tokens
        for sSPELL tokens. sSPELL tokens grant wizards voting rights and a claim
        on fees.
      </p>

      <p class="small-text">
        The middle section displays the wizard’s current CDPs.
      </p>

      <p class="small-text">
        The TOTAL BORROWED displays the total amount of MIM debt and from how
        many different CDPs.
      </p>
      <p class="small-text">
        The TOTAL REPAYED displays the total amount of MIM the user repaid
        acroos all CDPs.
      </p>
      <p class="small-text">
        The OPEN DEALs displays the different ibTKN that have been used to open
        CDPs
      </p>
      <p class="small-text">
        The orange liquidation box flags the user when his CDP are at risk for
        liquidation.
      </p>
      <p class="small-text">
        The bottom section will display a number of small windows equal to an
        individual's currently opened CDPs. Here wizards can borrow more MIM
        versus their ibTKNs or repay some of their owed MIM.
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
.docs-view {
  background-repeat: repeat;
  background-position: center;
  padding-top: $headerHeight + 85px;
  padding-bottom: $footerHeight + 85px;

  .small-text {
    font-size: 16px;
  }

  .princess-img {
    width: 200px;
    height: auto;
    margin-right: 100px;
    margin-left: 10px;
    transform: translateY(-25%);
  }

  .full-img {
    width: 100%;
    height: auto;
    margin-bottom: 30px;
  }

  .info-item {
    background: $clrBg2;
    border-radius: 12px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10px;
    padding: 10px 20px;

    p {
      font-size: 14px;
      padding: 0;
    }

    .mini {
      font-size: 12px;
      padding-top: 15px;
    }
  }

  .info-items-wrap {
    max-width: 690px;
    margin-left: auto;
    margin-right: auto;
  }

  .contracts-col {
    padding-right: 55px;

    .token-item {
      padding: 10px 15px;
      background: $clrBg2;
      border-radius: 12px;
      margin-bottom: 20px;

      p {
        padding: 0;
      }
    }
  }

  .header-img {
    margin: 60px auto;
    width: 100%;
    height: auto;
    max-width: 1440px;
  }

  .chest-img {
    width: 380px;
    height: auto;
    object-fit: contain;
  }

  .coins-wrap {
    margin: 60px 0;
    margin-left: 15%;
  }

  .spells-img {
    width: 220px;
    height: 260px;
    object-fit: contain;
    transform: translateY(20%);
  }

  .coin-img {
    width: 50px;
    height: auto;
    object-fit: contain;
    margin: 0 10px;
  }

  .text-wrap {
    padding-left: 25px;
  }

  h1 {
    margin-bottom: 60px;
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
    padding-bottom: 30px;
    text-align: left;
  }

  img {
    &.book-img {
      width: 330px;
      height: auto;
      object-fit: contain;
    }
  }

  .row {
    display: flex;
    align-items: center;
  }
}

@media screen and(max-width: 1280px) {
  .docs-view .title {
    font-size: 24px;
  }

  .docs-view p {
    font-size: 18px;
  }
}

@media screen and(max-width: 980px) {
  .docs-view img.book-img {
    width: 290px;
  }

  .docs-view .spells-img {
    width: 130px;
    height: auto;
  }

  .docs-view .chest-img {
    width: 300px;
  }
}

@media screen and(max-width: 860px) {
  .docs-view .row {
    flex-wrap: wrap;
  }

  .docs-view img.book-img,
  .docs-view .chest-img,
  .docs-view .princess-img {
    width: 100%;
    max-width: 300px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(0%);
  }

  .docs-view .princess-img {
    margin-top: 30px;
    margin-left: auto;
    margin-right: 20px;
    max-width: 150px;
  }

  .docs-view .coin-img {
    width: 40px;
  }

  .docs-view .spells-img {
    transform: translateY(0%);
  }

  .docs-view .text-wrap {
    padding-left: 0;
  }

  .docs-view .contracts-col {
    padding-right: 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and(max-width: 640px) {
  .docs-view .contracts-col .token-item {
    padding: 10px 5px;
  }

  .docs-view .contracts-col .token-item p {
    font-size: 15px;
  }
}
</style>
