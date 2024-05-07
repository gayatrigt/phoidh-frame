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
import path, { join } from 'path'

// import { readFile } from 'fs/promises';
// const localFont = await readFile(process.cwd() + "/app/fonts/Geist-Regular.ttf");
// console.log("🚀 ~ process.cwd() + ' / app / fonts / Geist - Regular.ttf':", process.cwd() + "/app/fonts/Geist-Regular.ttf")


// export const fonts = [
//   // Geist font family
//   {
//     name: 'Geist',
//     data: fs.readFileSync(path.join(__dirname, '../../fonts/Geist-Thin.ttf')),
//     weight: 100,
//     style: 'normal',
//   },
// ];

// const fontpath = join(process.cwd(), "app/fonts/Geist-Regular.ttf");
// const fontData = fs.readFileSync(fontpath);

export const font = new Frog({
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: 'Jaro',
        weight: 400,
        source: 'google',
      },
    ],
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
      <div style={{
        display: "flex", flexDirection: 'column',
        justifyContent: "center", alignItems: "center", height: "100%"
      }}>
        {simpleMessage}
        <div
          style={{
            color: 'white',
            fontFamily: 'Jaro',
            display: 'flex',
            fontWeight: 400,
            fontSize: 60,
          }}
        >
          Bounty Title
        </div>
        <div
          style={{
            color: 'white',
            fontFamily: 'Jaro',
            display: 'flex',
            fontWeight: 400,
            fontSize: 20,
          }}
        >
          Give your bounty a clear and concise title that accurately reflects the task or project you want to be completed (e.g., "FC Client like Discord ").
        </div>
      </div>
    ),
    imageOptions: {
      fonts: [
        {
          name: 'Jaro',
          source: 'google',
          style: 'normal',
        },
      ],
    },
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
      <Button.Link href={`https://warpcast.com/~/compose?text=Hey%2C%20I%20just%20created%20a%20bounty%20on%20poidh%21
      !&embeds[]=https://phoidh-frame.vercel.app/api//bounty/${c.transactionId}`}>Share</Button.Link>,
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

const convert = (rawValue: string) => {
  try {
    const result = (parseInt(rawValue) / 1000000000000000000).toString()
    console.log("🚀 ~ convert ~ result:", result)
    return result
  } catch (error) {
    console.error(error)
  }
}

app.frame('/bounty/:txHash', async (c) => {
  const { deriveState, req } = c;

  // get the txn hash
  const txHash = c.req.param('txHash')
  console.log("🚀 ~ app.frame ~ txHash:", txHash)

  // get data from txn hash

  const data = await fetch(`https://explorer.degen.tips/api/v2/transactions/${txHash}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())

  console.log({ data: data.decoded_input.parameters })
  const title = data.decoded_input.parameters.find((gayatri: any) => gayatri.name === 'name').value
  const description = data.decoded_input.parameters.find((gayatri: any) => gayatri.name === 'description').value

  const valueResult = convert(data.value)

  // const title = data: data.decoded_input.parameters

  return c.res({
    action: '',
    image: (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "100%" }}>
        {simpleMessage}
        <div style={{ fontSize: '48', fontWeight: 'bold' }}>
          {title}
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          {description}
        </div>
        <div style={{ fontSize: '32', width: '60%', textAlign: 'center' }}>
          {`Reward: $DEGEN ${valueResult}`}
        </div>
      </div>
    )
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
