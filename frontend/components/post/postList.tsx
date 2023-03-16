import styles from '@/styles/_post.module.scss';
import { PostProps } from "@/services/interface";
import Link from 'next/link';
import moment from 'moment';

const PostLists = ({ item }: { item: PostProps }) => {
    return (
        <li className={styles.post_lists} key={item._id}>
            <Link href={`/${item._id}`}>{item.title}</Link>
            <span>{moment(item.createdAt).format('YYYY-MM-DD')}</span>
            <div style={{clear: "both"}}></div>
        </li>
    );
};

export default PostLists;