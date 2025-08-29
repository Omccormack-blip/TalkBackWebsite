class VideoPreloaderService {
  private videoCache: Map<string, string> = new Map();
  private preloadPromises: Map<string, Promise<string>> = new Map();

  async preloadVideos(): Promise<void> {
    const videoFiles = [
      '/videos/1.mp4',
      '/videos/2.mp4',
      '/videos/3.mp4'
    ];

    const promises = videoFiles.map(path => this.preloadVideo(path));
    await Promise.all(promises);
  }

  private async preloadVideo(path: string): Promise<string> {
    if (this.videoCache.has(path)) {
      return this.videoCache.get(path)!;
    }

    if (this.preloadPromises.has(path)) {
      return this.preloadPromises.get(path)!;
    }

    const promise = fetch(path)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        this.videoCache.set(path, url);
        return url;
      });

    this.preloadPromises.set(path, promise);
    return promise;
  }

  getVideoUrl(videoNumber: number): string {
    const path = `/videos/${videoNumber}.mp4`;
    return this.videoCache.get(path) || path;
  }

  cleanup(): void {
    this.videoCache.forEach(url => URL.revokeObjectURL(url));
    this.videoCache.clear();
    this.preloadPromises.clear();
  }
}

export const VideoPreloader = new VideoPreloaderService();