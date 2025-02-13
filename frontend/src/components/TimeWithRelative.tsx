import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

export default function TimeWithRelative({ time }: { time: dayjs.Dayjs }) {
  return (
    <abbr title={time.fromNow()}>
      {time.format('YYYY-MM-DD HH:mm:ss')}
    </abbr>
  )
}
