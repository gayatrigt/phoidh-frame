/** @jsxImportSource frog/jsx */

// import { fonts } from '@/app/fonts/fonts'
import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { createSystem } from 'frog/ui'
import { abi } from "../../abi"
// fonts.js
import fs from 'fs'
import path from 'path'

// export const fonts = [
//   // Geist font family
//   {
//     name: 'Geist',
//     data: fs.readFileSync(path.join(__dirname, '../../fonts/Geist-Thin.ttf')),
//     weight: 100,
//     style: 'normal',
//   },
// ];

const { Text, Image, Heading } = createSystem()

export const {
  // ...
} = createSystem({
  colors: {
    text: '#ffffff',
  },
})

type State = {
  title: string
  description: string
  type: string
  reward: number
  bountyType: string
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  initialState: {
    title: "",
    description: "",
    type: "",
    reward: 0,
    bountyType: ""
  }
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

const simpleMessage = <div
  style={{
    alignItems: 'center',
    backgroundImage: `url("${process.env.NEXT_PUBLIC_SITE_URL}/bg-poidh.png")`,
    backgroundSize: '100% 100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    position: "absolute",
    top: 0,
    left: 0
  }}
>
  <div style={{
    alignItems: 'center',
    // background: 'white',
    height: 150,
    width: 480,
    transform: "scale(.3)",
    display: 'flex',
    backgroundRepeat: 'no-repeat',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    textAlign: 'center',
    objectFit: "contain",
    backgroundSize: "contain",
    position: "absolute",
    top: 0,
    backgroundImage: `url("${process.env.NEXT_PUBLIC_SITE_URL}/logo-poidh.png")`,
  }}
  >
  </div>
</div >

app.frame('/', (c) => {
  return c.res({
    action: '/bountytitle',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/screen-1.png`,
    intents: [
      <Button value="start">Create a Bounty</Button>,
    ],
  })
})

app.frame('/bountytitle', (c) => {

  return c.res({
    action: '/bountydescription',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          Bounty Title
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Give your bounty a clear and concise title that accurately reflects the task or project you want to be completed (e.g., "FC Client like Discord ").
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your Title..." />,
      <Button value="submit">Submit</Button>,
    ],
  })
})

app.frame('/bountydescription', (c) => {
  const { buttonValue, inputText, deriveState } = c;

  if (!inputText?.length) {
    return c.error({ message: "Please enter a valid title", statusCode: 403 })
  }

  if (buttonValue === 'submit') {
    deriveState((previousState: State) => {
      previousState.title = inputText;
    });
  }

  return c.res({
    action: '/bountyreward',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          Bounty Description
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Provide a detailed description of the bounty, including any specific requirements, guidelines, or expectations. Be as clear as possible to attract the right contributors and ensure successful completion.
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your Description..." />,
      <Button value="submit">Submit</Button>,
    ],
  })
})

app.frame('/bountyreward', (c) => {
  const { buttonValue, inputText, deriveState } = c;

  if (!inputText?.length) {
    return c.error({ message: "Please enter a valid description", statusCode: 403 })
  }

  if (buttonValue === 'submit') {
    deriveState((previousState: State) => {
      previousState.description = inputText;
    });
  }

  return c.res({
    action: '/bountytype',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          Reward Amount
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Specify the reward amount you are offering in DEGEN. poidh ensures secure and transparent transactions through the power of smart contracts.
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your $DEGEN..." />,
      <Button value="submit">Submit</Button>,
    ],
  })
})

app.frame('/bountytype', (c) => {
  const { buttonValue, inputText, deriveState } = c;

  if (!inputText) {
    return c.error({ message: "Please enter a valid reward", statusCode: 403 })
  }

  if (buttonValue === 'submit') {
    deriveState(previousState => {
      previousState.reward = parseInt(inputText);
    });
  }

  return c.res({
    action: '/wallet',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          Solo or Open bounty
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Solo Bounty: You are the sole creator and have full control over the bounty funds.
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Open Bounty: Harness the power of the community by allowing anyone to contribute additional funds to the bounty, increasing the reward pool and attracting more talented contributors.
        </div>
      </div>
    ),
    intents: [
      <Button value="solo">Solo Bounty</Button>,
      <Button value="open">Open Bounty</Button>,
    ],
  })
})

app.frame('/wallet', (c) => {
  const { buttonValue, deriveState } = c;

  const state = deriveState((previousState: State) => {
    if (buttonValue === 'solo' || buttonValue === 'open') {
      previousState.bountyType = buttonValue;
    }
  });

  console.log({ state })


  return c.res({
    action: '/share',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          Connect Wallet to Confirm the Bounty
        </div>
        {/* <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Solo Bounty: You are the sole creator and have full control over the bounty funds.
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          Open Bounty: Harness the power of the community by allowing anyone to contribute additional funds to the bounty, increasing the reward pool and attracting more talented contributors.
        </div> */}
      </div>
    ),
    intents: [
      <Button.Transaction target="/mint">Connect Wallet</Button.Transaction>,
    ],
  })
})

app.frame('/share', (c) => {
  const { deriveState } = c;

  const state = deriveState();
  console.log({ state })

  return c.res({
    action: '/',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          {state.title}
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          {state.description}
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          {`Reward: ${state.reward} `}
        </div>
      </div>
    ),
    intents: [
      <Button value="share">Share</Button>,
      <Button.Link href={`https://explorer.degen.tips/tx/${c.transactionId}`}> Check TxN </Button.Link>,
    ],
  })
})

app.transaction('/mint', (c) => {
  const state = c.previousState;

  return c.contract({
    abi,
    chainId: 'eip155:666666666',
    functionName: state.type == 'solo' ? "createSoloBounty" : "createOpenBounty",
    args: [
      state.title, state.description
    ],
    to: '0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814',
    value: parseEther(state.reward + "")
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
