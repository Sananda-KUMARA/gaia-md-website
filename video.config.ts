type MuxConfig = {
    enabled: boolean;
    tokenId: string | undefined;
    tokenSecret: string | undefined;
  };
  
  type VideoConfig = {
    provider: 'mux';
    input: string;
    output: string;
    mux: MuxConfig;
  };
  
  const config: VideoConfig = {
    provider: 'mux',
    input: 'videos',
    output: '.next-video',
    mux: {
      enabled: true,
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET
    }
  };
  
  export default config;