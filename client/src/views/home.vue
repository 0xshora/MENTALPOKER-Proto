<template>
  <div class="home-container container">
    <div class="room-btn"
         v-show="showBtn">
      <div class="room-config" v-show="showRoomConfig">
        <div class="room-config-shadow" @click="showRoomConfig = false"></div>
        <div class="room-config-body">
          <h1> room config</h1>
          <div class="input-bd">
            <div class="input-name">smallBlind:</div>
            <div class="input-text">
              <input type="tel"
                     v-model="smallBlind"/>
            </div>
          </div>
          <div class="input-bd">
            <div class="input-name">isShort:</div>
            <div class="input-text">
              <input type="checkbox"
                     v-model="isShort"/>
            </div>
          </div>
          <div class="btn"  @click="createRoom"><span>create</span></div>
        </div>
      </div>
      <div class="create-room btn"
          @click="showRoomConfig = true" ><span>create room</span>
      </div>
      <div class="btn"
           @click="joinRoom"><span>join room</span>
      </div>
      <div class="btn"
           @click="getRecord(0)"><span>test record</span>
      </div>
      <div class="btn" @click="selfPast7DayGame()">
            <span>7 day game history</span>
      </div>
    </div>
    <div class="room-number"
         v-show="isJoin">
      <div class="room-input inline">
        <div class="input-bd"
             :class="{error: isError}">
          <div class="input-name iconfont icon-password"></div>
          <!-- use 0x4d224452801ACEd8B2F0aebE155379bb5D594381 for APE COIN -->
          <div class="input-text">
            <input type="tel"
                   maxlength="6"
                   @focus="isError = false"
                   v-model="roomNumber"/>
          </div>
        </div>
      </div>
      <div class="room-btn inline">
        <span @click="go">go</span>
      </div>
    </div>
    <gameRecord v-model="showRecord"
                :game-list="gameList"
                :curr-game-index="currGameIndex"
                @getRecord = "getRecord"
                :command-list="commandList"></gameRecord>
  </div>
</template>

<script lang="ts">
  import { Vue } from 'vue-property-decorator';
  import Component from 'vue-class-component';
  import gameRecord from '@/components/GameRecord.vue';
  import service from '../service';
  import cookie from 'js-cookie';
  import { IGameRecord } from '@/interface/IGameRecord';
  import {ENV} from '@pushprotocol/restapi/src/lib/constants'

  import * as PushAPI from "@pushprotocol/restapi";
  import * as ethers from "ethers";

  const PK = '6a415229412f77079e4ccae956aee84ab5eb3647e86f2c5ae70d7d3170e5bc0e'; // channel private key
  const Pkey = `0x${PK}`;
  const _signer = new ethers.Wallet(Pkey);

  @Component({
    components: {
      gameRecord,
    },
  })
  export default class Home extends Vue {
    public roomNumber: string = '';
    private isJoin = false;
    private showBtn = true;
    private isError = false;
    private isShort = false;
    private smallBlind = 1;
    private showRoomConfig = false;
    private showRecord = false;
    private commandList = [];
    private currGameIndex = 0;
    private gameList: IGameRecord [] = [];

    public sendNotification = async() => {
      try {
        const apiResponse = await PushAPI.payloads.sendNotification({
          signer: _signer,
          senderType: 0,
          type: 1, // broadcast
          identityType: 2, // direct payload
          notification: {
            title: `[SDK-TEST] notification TITLE:`,
            body: `[sdk-test] notification BODY`
          },
          payload: {
            title: `[sdk-test] payload title`,
            body: `Started PokerGame!!`,
            cta: '',
            img: ''
          },
          // channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
          channel: 'eip155:5:0x4daFb41EB2633e3F4029deEDb37C163a6cB0B737', // your channel address
          env: ENV.STAGING,
        });
      } catch (err) {
        console.error('Error: ', err);
      }
    };

    private async createRoom() {
      try {
        const result = await service.createRoom(this.isShort, this.smallBlind, 0);
        const { roomNumber } = result.data;
        const roomConfig = {
          isShort: this.isShort,
          smallBlind: this.smallBlind,
        };
        localStorage.setItem('roomConfig', JSON.stringify(roomConfig));
        cookie.set('roomConfig', roomConfig, {expires: 1});
        this.$router.push({ name: 'game', params: { roomNumber, isOwner: '1' } });

        console.log("createRoom");
        this.sendNotification();
        
      } catch (e) {
        console.log(e);
      }
    }

    private joinRoom() {
      this.isJoin = true;
      this.showBtn = false;
    }

    private async go() {
      if (!/^\d+$/.test(this.roomNumber)) {
        this.isError = true;
        return;
      }
      try {
        const { data } = await service.findRoom(this.roomNumber);
        if (data) {
          const roomConfig = {
            ...data,
          };
          cookie.set('roomConfig', roomConfig, {expires: 1});
          this.$router.push({ name: 'game', params: { roomNumber: this.roomNumber } });
        } else {
          this.$plugin.toast('can\'t find the room');
          console.log('can\'t find the room');
        }
      } catch (e) {
        this.$plugin.toast('can\'t find the room');
      }
    }

    private async selfPast7DayGame() {
      try {
        const userIDStr = cookie.get('user_id');
        if (userIDStr) {
          const userID = Number(userIDStr);
          const {data} = await service.selfPast7DayGame(userID);
          data.forEach((v: IGameRecord) => {
            this.gameList.push({ gameId: v.gameId});
          });
          this.currGameIndex = data.length;
          this.commandList = data[data.length - 1].gameCommandList;
          this.showRecord = true;
        }
      } catch (e) {
        console.log(e);
        this.$plugin.toast('can\'t find the user command record list');
      }
    }

    private async getRecord(index: number) {
      try {
        console.log('ccc');
        let gameId = 0;
        if (!index) {
          const result = await service.gameRecordList('889008');
          this.gameList = Object.values(result.data);
          gameId = this.gameList[this.gameList.length - 1].gameId;
          this.currGameIndex = this.gameList.length;
          console.log('ccc len', this.gameList.length);
        } else {
          this.currGameIndex = index;
        }
        console.log(gameId, 'ccc11');
        gameId = this.gameList[index].gameId;
        const { data } = await service.commandRecordList('889008', gameId);
        this.commandList = data.commandList;
        this.showRecord = true;
        console.log(data);
      } catch (e) {
        console.log(e);
        this.$plugin.toast('can\'t find the room');
      }
    }
  }
</script>
<style lang="less"
       scoped>
  .home-container {
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    .room-config{
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      .room-config-shadow{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 9;
        background-color: rgba(0,0,0,.3);
      }
      .room-config-body{
        position: absolute;
        background-color: #fff;
        border-radius: 8px;
        left: 50%;
        top: 50%;
        z-index: 99;
        width: 230px;
        min-height: 200px;
        transform: translate3d(-50%, -50%, 0);
        h1{
          font-size: 16px;
          text-align: center;
          line-height: 40px;
        }
        .input-bd{
          display: flex;
          .input-name{
            width: 20vw;
            text-align: right;
          }
          .input-text{
            margin-left: 8px;
            line-height: 30px;
            input{
              width: 10vw;
              min-width: 10vw;
              display: inline-block;
              text-align: center;
              vertical-align: middle;
              border-bottom: 1px solid #bababa;
              &[type=checkbox]{
                width: 4vw;
                height: 4vw;
                min-width: auto;
                min-height: auto;
              }
            }
          }
        }
      }
    }

    .room-btn {
      flex: 1;

      .btn {
        width: 50vw;
        margin: 30px auto;
      }
    }

    .room-number {
      line-height: 40px;
      text-align: center;
      width: 100%;
      .error {
        border: 1px solid #e8050a;
      }
      .input-bd {
        border: 1px solid #bababa;
        border-radius: 4px;
        input {
          border-radius: 8px;
        }
      }
      .room-btn {
        height: 30px;
        margin-top: 0;

        span {
          margin: 0;
          line-height: 30px;
          height: 30px;
          font-size: 12px;
          color: #fff;
          background-color: #00976e;
          border-radius: 8px;
          padding: 0 20px;
          display: block;
        }
      }

      .inline {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
