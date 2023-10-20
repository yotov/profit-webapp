import { Command, CommandRunner, Option } from 'nest-commander';
import { createWriteStream } from 'node:fs';
import { parse } from 'date-fns';
import BigNumber from "bignumber.js";

interface CommandOptions {
  startTime?: Date;
  startPrice?: number;
  count?: number;
}

const separator = ",";
const newLine = "\n";

function getRandomNumber(rand, min, max) {
  return rand * (max - min) + min;
}

function getRandomNewPrice(price: BigNumber): BigNumber {
  const rand = Math.random();
  if (rand < 0.1) {
    return price;
  } else if (rand < 0.7) {
    return price.plus(getRandomNumber(rand, 0.001, 0.005));
  }
  return price.minus(getRandomNumber(rand, 0.002, 0.004));
}

@Command({
  name: 'generate-price-history',
  description: 'A cli script that generates sample data',
})
export class PriceHistoryCommandModule extends CommandRunner {
  async run(passedParam: string[], options?: CommandOptions): Promise<void> {
    console.log(new Date());
    const startTime = (options?.startTime ?? new Date()).setMilliseconds(0);
    const count = options?.count ?? 10_000;
    let price = new BigNumber(options?.startPrice ?? 100);

    const stream = createWriteStream("./data/history.csv", {highWaterMark: 2 * 1024 * 1024});
    for(let i = 0; i < count; i++)
    {
      price = getRandomNewPrice(price);
      const res = stream.write((startTime + i * 1000) + separator + price.toFixed(3) + newLine);
      if(!res) {
        console.log('Waiting drain at: ', i);
        await new Promise(resolve => stream.once("drain", resolve));
      }
    }
    stream.end();
    console.log(new Date());
  }

  @Option({
    flags: '-c, --count [number]',
    description: 'The count of prices in sample data',
  })
  parseCount(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --start-price [number]',
    description: 'The starting price of sample data',
  })
  parseStartPrice(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-d, --start-time [time]',
    description: 'The starting time of sample data ( in "yyyy-MM-dd HH:mm:ss" format )',
  })
  parseStartTime(val: string): Date {
    return parse(val, "yyyy-MM-dd HH:mm:ss", new Date());
  }
}
