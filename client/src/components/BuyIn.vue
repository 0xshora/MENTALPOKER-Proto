<template>
  <div class="buy-in"
       v-show="showBuyIn">
    <div class="shadow"
         @click="closeBuyIn"></div>
    <div class="buy-in-body">
      <div class="input-bd">
        <div class="input-name"><span>buy in: </span><input type="number" v-model="buyInSize"></div>
        <range :max="max"
               :min="min"
               v-model="buyInSize"
               @change="getBuyInSize"></range>
      </div>
      <div class="btn"><span @click="buyIn">buy in</span></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
  import range from './Range.vue';
  ///Airtable呼び出し
  import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
  const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql';
  const AIRSTACK_API_KEY = '<API_KEY>';

  const client = new ApolloClient({
    uri: AIRSTACK_ENDPOINT,
    cache: new InMemoryCache(),
    headers: { Authorization: AIRSTACK_API_KEY },
  });
  ///Airtable呼び出し

  @Component({
    components: {
      range,
    },
  })
  export default class BuyIn extends Vue {
    @Prop() private showBuyIn!: boolean;
    @Prop() private min!: number;
    @Prop() private max!: number;
    private buyInSize: number = 0;

    @Watch('buyInSize')
    private wBuyInSize(val: number) {
      this.buyInSize = val > this.max ? this.max : val < this.min ? this.min : val;
    }

    private getBuyInSize(val: string) {
      this.buyInSize = Number(val);
    }

    private closeBuyIn() {
      this.$emit('update:showBuyIn', false);
    }

    private async buyIn() {
      this.closeBuyIn();
      this.showNft();
      this.$emit('buyIn', this.buyInSize);

    }
    private async showNft() {
      let owners = ["vitalik.eth", "dwr.eth"];
      let limit = 10;
      let cursor = "";

      let response = await this.getNFTs(owners, limit, cursor);
      console.log(response);
      return response;
      // console.log('ここまで');
      // let originalValue: string | undefined;
      //   for (let i = 0; i < response.TokenBalance.length; i++) {
      //     const contentValue = response.TokenBalance[i].tokenNfts.contentValue;
      //     if (contentValue && contentValue.original !== undefined) {
      //       originalValue = contentValue.original;
      //     break;
      //     }
      //   }
      //   if (originalValue !== undefined) {
      //   console.log(originalValue);
      // }

    }
    private getNFTs = async (
      owners: string[],
      limit: number,
      cursor: string
    ): Promise<any> => {
      const query = gql`
        query MyQuery($cursor: String, $owners: [Identity!], $limit: Int) {
          TokenBalances(
            input: {
              filter: {
                owner: { _in: $owners },
                tokenType: { _in: [ERC1155, ERC721] }
              }
              blockchain: ethereum
              limit: $limit
              cursor: $cursor
            }
          ) {
            TokenBalance {
              tokenAddress
              amount
              tokenNfts {
                contentValue {
                  image {
                    original
                  }
                }
              }
              tokenType
              owner {
                primaryDomain {
                  name
                }
              }
            }
            pageInfo {
              prevCursor
              nextCursor
            }
          }
        }
      `; 

      const response = await client.query({
        query,
        variables: {
          owners: owners,
          limit: limit,
          cursor: cursor,
        },
      });

      return response.data.TokenBalances;
    };

    private mounted() {
      this.buyInSize = this.min;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped
       lang="less">
  .buy-in {
    position: fixed;
    z-index: 99;

    .shadow {
      position: fixed;
      z-index: 9;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
    }

    .buy-in-body {
      z-index: 99;
      position: fixed;
      left: 50%;
      top: 50%;
      margin: -100px -150px;
      width: 300px;
      border-radius: 12px;
      box-sizing: border-box;
      background: #fff;
      padding: 20px;
    }

    .input-text {
      input {
        width: 100px;
      }
    }
    .input-name{
      margin-bottom: 15px;
      font-size: 20px;
      text-align: center;
      input{
        width: 70px;
        font-size: 20px;
      }
    }
    .btn{
      margin-top: 20px;
    }
  }

</style>
