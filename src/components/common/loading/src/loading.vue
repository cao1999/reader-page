<template>
    <div id="loading">
        <div class="loading-animation"></div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
#loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    padding: 20px;
    background-color: rgba(0,0,0,0.5);
}

.loading-animation {
    width: 70px;
    height: 70px;
    border: 5px solid #ccc;
    border-top-color: #fff;
    border-radius: 50%;
    animation: loading 1s infinite linear;
}

@keyframes loading {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>