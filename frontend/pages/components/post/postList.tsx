import styles from '@/styles/_post.module.scss';
import { PostProps } from "@/pages/api/interface";
import Link from 'next/link';

const PostLists = ({ item }: { item: PostProps }) => {
    return (
        <li className={styles.post_lists} key={item.id}>
            <Link href={`/${item.id}`}>{item.title}</Link>
            <span>{item.createdAt}</span>
            <div style={{clear: "both"}}></div>
        </li>
    );
};

export default PostLists;