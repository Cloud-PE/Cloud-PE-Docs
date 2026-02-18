<template>
  <div ref="artRef" class="art-player-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Artplayer from 'artplayer'

interface Quality {
  default?: boolean
  html: string
  url: string
  audioUrl?: string  // 可选的独立音频源
}

interface AudioTrack {
  default?: boolean
  html: string
  url: string
}

const props = defineProps<{
  url?: string
  qualities?: Quality[] | string  // 支持数组或 JSON 字符串
  audioTracks?: AudioTrack[] | string  // 音轨配置
  poster?: string
  title?: string
}>()

const artRef = ref<HTMLDivElement>()
let art: Artplayer | null = null

onMounted(() => {
  if (!artRef.value) return

  // 获取 VitePress 品牌色
  const brandColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vp-c-brand-1')
    .trim() || '#3451b2'

  // 解析 qualities（支持数组或 JSON 字符串）
  let qualitiesArray: Quality[] | undefined
  if (props.qualities) {
    if (typeof props.qualities === 'string') {
      try {
        qualitiesArray = JSON.parse(props.qualities)
      } catch (e) {
        console.error('Failed to parse qualities JSON:', e)
      }
    } else {
      qualitiesArray = props.qualities
    }
  }

  // 解析 audioTracks（支持数组或 JSON 字符串）
  let audioTracksArray: AudioTrack[] | undefined
  if (props.audioTracks) {
    if (typeof props.audioTracks === 'string') {
      try {
        audioTracksArray = JSON.parse(props.audioTracks)
      } catch (e) {
        console.error('Failed to parse audioTracks JSON:', e)
      }
    } else {
      audioTracksArray = props.audioTracks
    }
  }

  // 构建播放器配置
  const playerOptions: any = {
    container: artRef.value,
    poster: props.poster || '',
    title: props.title || '',
    volume: 1.0,  // 默认音量100%
    isLive: false,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: true,
    autoMini: true,
    screenshot: true,
    setting: true,
    loop: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    theme: brandColor, // 使用 VitePress 品牌色
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
      crossOrigin: 'anonymous',
    },
  }

  // 如果提供了 qualities 数组，使用分辨率切换功能
  if (qualitiesArray && qualitiesArray.length > 0) {
    playerOptions.quality = qualitiesArray
    // 设置默认分辨率的 URL 作为初始视频源
    const defaultQuality = qualitiesArray.find(q => q.default) || qualitiesArray[0]
    playerOptions.url = defaultQuality.url
  } else if (props.url) {
    // 否则使用单一 URL（向后兼容）
    playerOptions.url = props.url
  }

  art = new Artplayer(playerOptions)

  // 添加音轨切换功能
  if (audioTracksArray && audioTracksArray.length > 0) {
    let currentAudioTrack = audioTracksArray.find(t => t.default) || audioTracksArray[0]
    let audioElement: HTMLAudioElement | null = null
    let isInitializing = false  // 标志位：是否正在初始化

    // 创建独立的音频元素
    const createAudioElement = (audioUrl: string) => {
      if (audioElement) {
        audioElement.pause()
        audioElement.remove()
      }

      audioElement = document.createElement('audio')
      audioElement.src = audioUrl
      audioElement.crossOrigin = 'anonymous'
      audioElement.style.display = 'none'
      document.body.appendChild(audioElement)

      const video = art!.video

      // 同步函数
      const sync = () => {
        if (audioElement && !isNaN(audioElement.duration)) {
          audioElement.currentTime = video.currentTime
        }
      }

      // 监听视频元素的原生事件（更可靠）
      video.addEventListener('play', () => {
        sync()
        audioElement?.play().catch(e => console.error('Audio play error:', e))
      })

      video.addEventListener('pause', () => {
        audioElement?.pause()
      })

      video.addEventListener('seeked', () => {
        sync()
      })

      video.addEventListener('volumechange', () => {
        // 初始化期间忽略 volumechange 事件
        if (isInitializing) return
        
        if (audioElement) {
          // 直接使用播放器的音量和静音状态
          audioElement.volume = art!.volume
          audioElement.muted = art!.muted
          
          // 如果取消静音且正在播放，立即播放音频
          if (!video.paused && !art!.muted && audioElement.paused) {
            audioElement.play().catch(e => console.error('Audio play error:', e))
          }
        }
      })

      // 初始化音频状态
      audioElement.volume = art!.volume
      audioElement.muted = art!.muted

      // 如果视频正在播放，立即播放音频
      if (!video.paused) {
        sync()
        audioElement.play().catch(e => console.error('Audio play error:', e))
      }
    }

    // 等待播放器完全初始化后再配置音轨
    art.on('ready', () => {
      isInitializing = true  // 开始初始化
      
      // 先设置视频音量为0（避免播放原始音轨）
      art.video.volume = 0
      
      // 强制设置播放器状态
      setTimeout(() => {
        art.volume = 1.0
        art.muted = false
        isInitializing = false  // 初始化完成
      }, 50)
      
      // 创建初始音频元素
      if (currentAudioTrack.url) {
        createAudioElement(currentAudioTrack.url)
      }
    })

    // 只有多个音轨时才添加切换选项到设置面板
    if (audioTracksArray.length > 1) {
      art.setting.add({
        html: '音轨',
        tooltip: currentAudioTrack.html,
        selector: audioTracksArray.map(track => ({
          html: track.html,
          value: track.url,
          default: track.default || false,
        })),
        onSelect: (item: any) => {
          const selectedTrack = audioTracksArray!.find(t => t.url === item.value)
          if (selectedTrack) {
            currentAudioTrack = selectedTrack
            createAudioElement(selectedTrack.url)
            return item.html
          }
          return currentAudioTrack.html
        },
      })
    }

    // 清理函数
    const originalDestroy = art.destroy.bind(art)
    art.destroy = (removeHtml?: boolean) => {
      if (audioElement) {
        audioElement.pause()
        audioElement.remove()
        audioElement = null
      }
      originalDestroy(removeHtml)
    }
  }
})

onBeforeUnmount(() => {
  if (art && art.destroy) {
    art.destroy(false)
  }
})
</script>

<style scoped>
.art-player-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
}
</style>