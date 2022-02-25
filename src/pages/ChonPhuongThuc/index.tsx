import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import { Button, Divider, Select } from 'antd';
import { history, useModel } from 'umi';
import styles from './index.css';

const LuaChonPhuongThuc = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const danhSachDotTuyenSinh = [
    {
      id: 1,
      title:
        'Xét tuyển thẳng theo quy chế tuyển sinh của Bộ GD&ĐT và theo Đề án tuyển sinh của Học viện',
      time: 'Không có đợt nào',
      isCoHoSo: 'Thí sinh không có hồ sơ xét tuyển',
      trangThai: 'Chưa khóa',
    },
    {
      id: 2,
      title: 'Xét tuyển dựa vào kết quả thi tốt nghiệp THPT năm 2022',
      time: 'Có 2 đợt đang diễn ra',
      isCoHoSo: 'Thí sinh không có hồ sơ xét tuyển',
    },
    {
      id: 3,
      title: 'Xét tuyển kết hợp theo Đề án tuyển sinh của Học viện',
      time: 'Có 1 đợt đang diễn ra',
      isCoHoSo: 'Thí sinh có hồ sơ xét tuyển',
      trangThai: 'Chưa khóa',
    },
    {
      id: 4,
      title: 'Xét tuyển dựa vào kết quả các kỳ thi đánh giá năng lực',
      time: 'Không có đợt nào',
      isCoHoSo: 'Thí sinh không có hồ sơ xét tuyển',
    },
  ];
  return (
    <>
      {/* <div style={{ position: 'fixed', zIndex: 1000, width: '100%' }}> */}
      <Header />
      {/* </div> */}

      <div style={{ display: 'flex' }}>
        <div style={{ fontSize: 16 }} className={styles.background}>
          <div className={styles.container}>
            {/* <div className={styles.contentleft}>
              <img
                style={{ margin: '0 auto', maxWidth: 150, maxHeight: 250 }}
                width="60%"
                src={logo}
                alt=""
              />
            </div> */}
            <div style={{ width: 1000 }}>
              <div className={styles.content}>
                <div className={styles['content-top']}>
                  <b style={{ fontSize: 18 }}>Xin chào {initialState?.currentUser?.name},</b>
                  <div>
                    Bạn đang tham gia xét tuyển vào Học viện Công nghệ Bưu chính viễn thông hệ Đại
                    học Chính quy
                  </div>
                </div>
              </div>
              <div className={styles.form}>
                <div className={styles.title}>Vui lòng chọn phương thức để tiếp tục:</div>
                <br />
                <Select value={2022} style={{ width: 200 }}>
                  <Select.Option value={2022}>Năm tuyển sinh 2022</Select.Option>
                </Select>
                <div>
                  {danhSachDotTuyenSinh?.map((item, index) => (
                    <div
                      key={item.id}
                      className={styles.answer}
                      onClick={() => {
                        localStorage.setItem('phuongThuc', item.id.toString());
                        history.push('/hosothisinh/phuongthucxettuyen/chitiet');
                      }}
                    >
                      <Button type="default" size="large" shape="circle">
                        {index + 1}
                      </Button>
                      <div style={{ marginLeft: 8 }}>
                        <div>
                          <b>
                            Phương thức {index + 1}: {item?.title ?? ''}
                          </b>
                          <div>{item.time}</div>
                          <div>{item.isCoHoSo}</div>
                          {/* <div>Trạng thái: {item?.trangThai ?? ''}</div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {danhSachDotTuyenSinh?.length === 0 && (
                  <div>Chưa có thông tin về các đợt tuyển sinh ở kỳ tuyển sinh năm nay</div>
                )}
              </div>
              <Divider style={{ marginBottom: 0 }} />
              <div className={styles.footer}>
                <Button
                  className={styles['footer-btn']}
                  type="link"
                  onClick={() => {
                    setInitialState({ ...initialState, currentUser: undefined });
                    localStorage.removeItem('vaiTro');
                    localStorage.removeItem('token');
                    localStorage.removeItem('accessTokens');
                    localStorage.removeItem('phuongThuc');
                    localStorage.removeItem('dot');
                    history.push({
                      pathname: '/user/login',
                    });
                  }}
                >
                  Quay lại đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
};

export default LuaChonPhuongThuc;
