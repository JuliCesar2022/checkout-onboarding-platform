import { PaginationQueryDto } from './pagination-query.dto';
import { PaginatedResponseDto } from './paginated-response.dto';

describe('Common DTOs', () => {
  describe('PaginationQueryDto', () => {
    it('should allow instantiating PaginationQueryDto', () => {
      const dto = new PaginationQueryDto();
      dto.limit = 10;
      dto.cursor = 'abc';
      expect(dto.limit).toBe(10);
      expect(dto.cursor).toBe('abc');
    });
  });

  describe('PaginatedResponseDto', () => {
    class TestItem {
      id: string;
    }

    it('should create a paginated response class', () => {
      const PaginatedTestResponse = PaginatedResponseDto(TestItem);
      const response = new PaginatedTestResponse();
      response.data = [{ id: '1' }];
      response.hasMore = true;
      response.nextCursor = '2';

      expect(response.data).toHaveLength(1);
      expect(response.hasMore).toBe(true);
      expect(response.nextCursor).toBe('2');
    });
  });
});
