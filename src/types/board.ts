export type BoardCategory = 'info' | 'suggestion';

/** 클라이언트로 내려가는 게시글 (password_hash는 절대 포함하지 않는다). */
export interface BoardPost {
  id: number;
  category: BoardCategory;
  nickname: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
