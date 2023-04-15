<template>
<div class="walletDetailsContainer">

        <div class="iconImage">
            <img src="https://pbs.twimg.com/profile_images/1538519538194477056/jsaeCBX4_400x400.jpg" alt="Sample Image" class="round-image">
        </div>
        <div class="walletAddress">
            <p class="wrapped-text">0xe90C9f91a85aD5383C4229<br>Fa112a7fcDad8c4153</p>

        </div>


</div>
</template>

<script lang="ts">

export default {
  name: 'walletDetails',
};


</script>


<style scoped lang="less">
.walletDetailsContainer{
    font-size: 20px;
    position: absolute;
    bottom: 55px;
    right: 20px;
    width: 40vw;
    height: 13vh;
    border: 2px solid #98A5EB;
    background: rgba(152, 165, 235, 0.2);
    border-radius: 30px; /* この値を調整して、角の丸みを変更できます */
    display: flex;
    flex-direction: row;
    align-items: center
    
  
}


.walletAddress {
    width: fit-content;
    color: #98A5EB;
    font-size: 15px;



}
    .wrapped-text{
        word-wrap: break-word;
    }
.round-image {
      width: 7vw;
      height: 7vh;
      border-radius: 50%;
      object-fit: cover;
      padding: 5px
    }


</style>
